<?php
/**
 * Plugin Name:       Walking Shadow Commerce
 * Plugin URI:        https://walkingshadowpoetry.com/shop
 * Description:       Commerce backend for the Walking Shadow Poetry React storefront. Adds M-Pesa (Daraja) payments, poetry commission management, personalized-item persistence, and a newsletter endpoint on top of WooCommerce.
 * Version:           1.0.0
 * Author:            Walking Shadow Poetry
 * Author URI:        https://walkingshadowpoetry.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       walking-shadow-commerce
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * WC requires at least: 7.0
 * WC tested up to:   9.9
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

define( 'WSC_VERSION', '1.0.0' );
define( 'WSC_PLUGIN_FILE', __FILE__ );
define( 'WSC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WSC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WSC_REST_NAMESPACE', 'walkingshadow/v1' );

require_once WSC_PLUGIN_DIR . 'includes/class-wsc-settings.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-personalization.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-mpesa.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-gateway.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-commissions.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-newsletter.php';
require_once WSC_PLUGIN_DIR . 'includes/class-wsc-rest.php';

/**
 * Bootstraps the plugin once all plugins are loaded so WooCommerce is available.
 */
function wsc_bootstrap() {
	if ( ! class_exists( 'WooCommerce' ) ) {
		add_action( 'admin_notices', 'wsc_missing_woocommerce_notice' );
		return;
	}

	WSC_Settings::instance();
	WSC_Personalization::instance();
	WSC_Mpesa::instance();
	WSC_Commissions::instance();
	WSC_Newsletter::instance();
	WSC_Rest::instance();

	add_filter(
		'woocommerce_payment_gateways',
		static function ( $gateways ) {
			$gateways[] = 'WSC_Gateway';
			return $gateways;
		}
	);
}
add_action( 'plugins_loaded', 'wsc_bootstrap', 11 );

/**
 * Warns the administrator when WooCommerce is not active.
 */
function wsc_missing_woocommerce_notice() {
	echo '<div class="notice notice-error"><p>' .
		esc_html__( 'Walking Shadow Commerce requires WooCommerce to be installed and active.', 'walking-shadow-commerce' ) .
		'</p></div>';
}

/**
 * Declares compatibility with WooCommerce High-Performance Order Storage (HPOS).
 */
add_action(
	'before_woocommerce_init',
	static function () {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', WSC_PLUGIN_FILE, true );
		}
	}
);

/**
 * Plugin activation: register the commission post type so its rewrite rules
 * exist, then flush them, and seed default commission statuses.
 */
function wsc_activate() {
	WSC_Commissions::register_post_type();
	WSC_Commissions::seed_statuses();
	WSC_Settings::set_defaults();
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'wsc_activate' );

/**
 * Plugin deactivation: flush rewrite rules.
 */
function wsc_deactivate() {
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'wsc_deactivate' );

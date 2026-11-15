<?php
/**
 * Uninstall routine. Runs only when the plugin is deleted from the admin.
 *
 * Removes plugin options and transients. Commission posts are intentionally
 * preserved so no client work is lost; delete them manually if desired.
 *
 * @package WalkingShadowCommerce
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

delete_option( 'wsc_settings' );
delete_option( 'wsc_subscribers' );

delete_transient( 'wsc_mpesa_token' );

global $wpdb;
$wpdb->query( // phpcs:ignore WordPress.DB.DirectDatabaseQuery
	"DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_wsc_rl_%' OR option_name LIKE '_transient_timeout_wsc_rl_%'"
);

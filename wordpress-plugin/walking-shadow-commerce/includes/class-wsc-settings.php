<?php
/**
 * Plugin settings storage and admin screen.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Stores plugin configuration in a single option and renders the settings page.
 */
class WSC_Settings {

	const OPTION = 'wsc_settings';

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Settings|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Settings
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Registers hooks.
	 */
	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Default settings.
	 *
	 * @return array
	 */
	public static function defaults() {
		return array(
			'environment'         => 'sandbox',
			'consumer_key'        => '',
			'consumer_secret'     => '',
			'shortcode'           => '',
			'passkey'             => '',
			'transaction_type'    => 'CustomerPayBillOnline',
			'callback_url'        => rest_url( WSC_REST_NAMESPACE . '/mpesa/callback' ),
			'notification_email'  => get_option( 'admin_email' ),
			'allowed_origin'      => home_url(),
			'rate_limit_seconds'  => 60,
		);
	}

	/**
	 * Persists defaults for keys that do not yet exist.
	 */
	public static function set_defaults() {
		$current = get_option( self::OPTION, array() );
		if ( ! is_array( $current ) ) {
			$current = array();
		}
		update_option( self::OPTION, array_merge( self::defaults(), $current ) );
	}

	/**
	 * Returns a single setting value.
	 *
	 * @param string $key     Setting key.
	 * @param mixed  $default Fallback value.
	 * @return mixed
	 */
	public static function get( $key, $default = '' ) {
		$settings = get_option( self::OPTION, array() );
		if ( ! is_array( $settings ) ) {
			$settings = array();
		}
		$settings = array_merge( self::defaults(), $settings );
		return isset( $settings[ $key ] ) ? $settings[ $key ] : $default;
	}

	/**
	 * Returns the Daraja base URL for the configured environment.
	 *
	 * @return string
	 */
	public static function mpesa_base_url() {
		return 'production' === self::get( 'environment' )
			? 'https://api.safaricom.co.ke'
			: 'https://sandbox.safaricom.co.ke';
	}

	/**
	 * Adds the top-level admin menu.
	 */
	public function add_menu() {
		add_menu_page(
			__( 'Walking Shadow Commerce', 'walking-shadow-commerce' ),
			__( 'Walking Shadow', 'walking-shadow-commerce' ),
			'manage_options',
			'wsc-settings',
			array( $this, 'render_page' ),
			'dashicons-store',
			58
		);
	}

	/**
	 * Registers the option and its sanitisation callback.
	 */
	public function register_settings() {
		register_setting(
			'wsc_settings_group',
			self::OPTION,
			array( 'sanitize_callback' => array( $this, 'sanitize' ) )
		);
	}

	/**
	 * Sanitises submitted settings.
	 *
	 * @param array $input Raw input.
	 * @return array
	 */
	public function sanitize( $input ) {
		$input = is_array( $input ) ? $input : array();
		$clean = array();

		$clean['environment']        = in_array( ( $input['environment'] ?? '' ), array( 'sandbox', 'production' ), true )
			? $input['environment']
			: 'sandbox';
		$clean['consumer_key']       = sanitize_text_field( $input['consumer_key'] ?? '' );
		$clean['consumer_secret']    = sanitize_text_field( $input['consumer_secret'] ?? '' );
		$clean['shortcode']          = sanitize_text_field( $input['shortcode'] ?? '' );
		$clean['passkey']            = sanitize_text_field( $input['passkey'] ?? '' );
		$clean['transaction_type']   = in_array( ( $input['transaction_type'] ?? '' ), array( 'CustomerPayBillOnline', 'CustomerBuyGoodsOnline' ), true )
			? $input['transaction_type']
			: 'CustomerPayBillOnline';
		$clean['callback_url']       = esc_url_raw( $input['callback_url'] ?? '' );
		$clean['notification_email'] = sanitize_email( $input['notification_email'] ?? '' );
		$clean['allowed_origin']     = esc_url_raw( $input['allowed_origin'] ?? '' );
		$clean['rate_limit_seconds'] = max( 0, absint( $input['rate_limit_seconds'] ?? 60 ) );

		return array_merge( self::defaults(), $clean );
	}

	/**
	 * Renders the settings screen.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$settings = array_merge( self::defaults(), (array) get_option( self::OPTION, array() ) );
		$fields   = array(
			'environment'        => array( 'label' => __( 'Environment', 'walking-shadow-commerce' ), 'type' => 'select', 'options' => array( 'sandbox' => 'Sandbox', 'production' => 'Production' ) ),
			'consumer_key'       => array( 'label' => __( 'Daraja Consumer Key', 'walking-shadow-commerce' ), 'type' => 'text' ),
			'consumer_secret'    => array( 'label' => __( 'Daraja Consumer Secret', 'walking-shadow-commerce' ), 'type' => 'password' ),
			'shortcode'          => array( 'label' => __( 'Business Shortcode', 'walking-shadow-commerce' ), 'type' => 'text' ),
			'passkey'            => array( 'label' => __( 'Lipa na M-Pesa Passkey', 'walking-shadow-commerce' ), 'type' => 'password' ),
			'transaction_type'   => array( 'label' => __( 'Transaction Type', 'walking-shadow-commerce' ), 'type' => 'select', 'options' => array( 'CustomerPayBillOnline' => 'Paybill', 'CustomerBuyGoodsOnline' => 'Buy Goods (Till)' ) ),
			'callback_url'       => array( 'label' => __( 'Callback URL', 'walking-shadow-commerce' ), 'type' => 'url' ),
			'notification_email' => array( 'label' => __( 'Notification Email', 'walking-shadow-commerce' ), 'type' => 'email' ),
			'allowed_origin'     => array( 'label' => __( 'Allowed CORS Origin', 'walking-shadow-commerce' ), 'type' => 'url' ),
			'rate_limit_seconds' => array( 'label' => __( 'Rate Limit (seconds)', 'walking-shadow-commerce' ), 'type' => 'number' ),
		);
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Walking Shadow Commerce', 'walking-shadow-commerce' ); ?></h1>
			<p class="description">
				<?php esc_html_e( 'Configure M-Pesa Daraja credentials and storefront integration. The M-Pesa payment method is enabled under WooCommerce → Settings → Payments.', 'walking-shadow-commerce' ); ?>
			</p>
			<form method="post" action="options.php">
				<?php settings_fields( 'wsc_settings_group' ); ?>
				<table class="form-table" role="presentation">
					<tbody>
					<?php foreach ( $fields as $key => $field ) : ?>
						<tr>
							<th scope="row">
								<label for="wsc-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $field['label'] ); ?></label>
							</th>
							<td>
								<?php
								$name  = self::OPTION . '[' . $key . ']';
								$value = isset( $settings[ $key ] ) ? $settings[ $key ] : '';

								if ( 'select' === $field['type'] ) {
									echo '<select id="wsc-' . esc_attr( $key ) . '" name="' . esc_attr( $name ) . '">';
									foreach ( $field['options'] as $option_value => $option_label ) {
										printf(
											'<option value="%s" %s>%s</option>',
											esc_attr( $option_value ),
											selected( $value, $option_value, false ),
											esc_html( $option_label )
										);
									}
									echo '</select>';
								} else {
									printf(
										'<input id="wsc-%s" type="%s" name="%s" value="%s" class="regular-text" />',
										esc_attr( $key ),
										esc_attr( $field['type'] ),
										esc_attr( $name ),
										esc_attr( $value )
									);
								}
								?>
							</td>
						</tr>
					<?php endforeach; ?>
					</tbody>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}
}

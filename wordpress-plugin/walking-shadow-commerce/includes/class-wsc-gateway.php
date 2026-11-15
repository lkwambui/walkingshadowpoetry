<?php
/**
 * WooCommerce payment gateway for M-Pesa.
 *
 * The headless React storefront places the order through the Store API using
 * this gateway id, then triggers the STK push through the plugin REST route.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the M-Pesa payment method with WooCommerce.
 */
class WSC_Gateway extends \WC_Payment_Gateway {

	/**
	 * Sets up the gateway.
	 */
	public function __construct() {
		$this->id                 = 'walkingshadow_mpesa';
		$this->method_title       = __( 'M-Pesa (Daraja)', 'walking-shadow-commerce' );
		$this->method_description = __( 'Accept payments via Safaricom M-Pesa using an STK push. Configure credentials under Walking Shadow.', 'walking-shadow-commerce' );
		$this->has_fields         = false;
		$this->supports           = array( 'products' );

		$this->init_form_fields();
		$this->init_settings();

		$this->title       = $this->get_option( 'title', __( 'M-Pesa', 'walking-shadow-commerce' ) );
		$this->description = $this->get_option( 'description', __( 'Pay securely with M-Pesa. You will receive an STK push on your phone.', 'walking-shadow-commerce' ) );

		if ( '' === $this->get_option( 'enabled' ) ) {
			$this->enabled = 'yes';
		}

		add_action( 'woocommerce_update_options_payment_gateways_' . $this->id, array( $this, 'process_admin_options' ) );
	}

	/**
	 * Admin form fields for the gateway.
	 */
	public function init_form_fields() {
		$this->form_fields = array(
			'enabled'     => array(
				'title'   => __( 'Enable/Disable', 'walking-shadow-commerce' ),
				'type'    => 'checkbox',
				'label'   => __( 'Enable M-Pesa payments', 'walking-shadow-commerce' ),
				'default' => 'yes',
			),
			'title'       => array(
				'title'       => __( 'Title', 'walking-shadow-commerce' ),
				'type'        => 'text',
				'description' => __( 'Payment method title shown to customers.', 'walking-shadow-commerce' ),
				'default'     => __( 'M-Pesa', 'walking-shadow-commerce' ),
				'desc_tip'    => true,
			),
			'description' => array(
				'title'       => __( 'Description', 'walking-shadow-commerce' ),
				'type'        => 'textarea',
				'description' => __( 'Payment method description shown to customers.', 'walking-shadow-commerce' ),
				'default'     => __( 'Pay securely with M-Pesa. You will receive an STK push on your phone.', 'walking-shadow-commerce' ),
			),
		);
	}

	/**
	 * Returns true when the gateway has the credentials it needs.
	 *
	 * @return bool
	 */
	public function is_available() {
		if ( ! parent::is_available() ) {
			return false;
		}
		return (bool) WSC_Settings::get( 'shortcode' ) && (bool) WSC_Settings::get( 'consumer_key' );
	}

	/**
	 * Places the order on hold and marks it ready for an STK push.
	 *
	 * @param int $order_id Order ID.
	 * @return array
	 */
	public function process_payment( $order_id ) {
		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			wc_add_notice( __( 'Order could not be found.', 'walking-shadow-commerce' ), 'error' );
			return array( 'result' => 'failure' );
		}

		if ( ! $order->is_paid() ) {
			$order->update_status(
				'on-hold',
				__( 'Awaiting M-Pesa payment confirmation.', 'walking-shadow-commerce' )
			);
		}

		$order->update_meta_data( '_wsc_mpesa_state', 'pending' );
		$order->save();

		if ( WC()->cart ) {
			WC()->cart->empty_cart();
		}

		return array(
			'result'   => 'success',
			'redirect' => $order->get_checkout_order_received_url(),
		);
	}
}

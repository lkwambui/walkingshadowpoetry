<?php
/**
 * Safaricom M-Pesa (Daraja) client: OAuth, STK push and callback validation.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Talks to the Daraja API and reconciles payments with WooCommerce orders.
 */
class WSC_Mpesa {

	const TOKEN_TRANSIENT = 'wsc_mpesa_token';

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Mpesa|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Mpesa
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Registers the payment callback endpoint.
	 */
	private function __construct() {
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
	}

	/**
	 * Registers the public Daraja callback route.
	 */
	public function register_routes() {
		register_rest_route(
			WSC_REST_NAMESPACE,
			'/mpesa/callback',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'handle_callback' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Fetches (and caches) a Daraja OAuth access token.
	 *
	 * @return string|\WP_Error
	 */
	public function get_access_token() {
		$cached = get_transient( self::TOKEN_TRANSIENT );
		if ( $cached ) {
			return $cached;
		}

		$key    = WSC_Settings::get( 'consumer_key' );
		$secret = WSC_Settings::get( 'consumer_secret' );
		if ( ! $key || ! $secret ) {
			return new \WP_Error( 'wsc_mpesa_config', __( 'M-Pesa credentials are not configured.', 'walking-shadow-commerce' ) );
		}

		$response = wp_remote_get(
			WSC_Settings::mpesa_base_url() . '/oauth/v1/generate?grant_type=client_credentials',
			array(
				'timeout' => 20,
				'headers' => array(
					'Authorization' => 'Basic ' . base64_encode( $key . ':' . $secret ), // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
					'Accept'        => 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( empty( $body['access_token'] ) ) {
			return new \WP_Error( 'wsc_mpesa_token', __( 'Could not obtain an M-Pesa access token.', 'walking-shadow-commerce' ) );
		}

		$expires = isset( $body['expires_in'] ) ? max( 60, absint( $body['expires_in'] ) - 60 ) : 3000;
		set_transient( self::TOKEN_TRANSIENT, $body['access_token'], $expires );

		return $body['access_token'];
	}

	/**
	 * Normalises a Kenyan phone number into the 2547XXXXXXXX / 2541XXXXXXXX format.
	 *
	 * @param string $phone Raw phone number.
	 * @return string|false
	 */
	public function normalize_phone( $phone ) {
		$phone = preg_replace( '/[^0-9]/', '', (string) $phone );

		if ( preg_match( '/^0(7|1)\d{8}$/', $phone ) ) {
			return '254' . substr( $phone, 1 );
		}
		if ( preg_match( '/^254(7|1)\d{8}$/', $phone ) ) {
			return $phone;
		}
		if ( preg_match( '/^(7|1)\d{8}$/', $phone ) ) {
			return '254' . $phone;
		}

		return false;
	}

	/**
	 * Builds the Lipa na M-Pesa password and timestamp.
	 *
	 * @return array
	 */
	private function credentials() {
		$shortcode = WSC_Settings::get( 'shortcode' );
		$passkey   = WSC_Settings::get( 'passkey' );
		$timestamp = gmdate( 'YmdHis' );

		return array(
			'shortcode'  => $shortcode,
			'timestamp'  => $timestamp,
			'password'   => base64_encode( $shortcode . $passkey . $timestamp ), // phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		);
	}

	/**
	 * Initiates an STK push for an order and stores the Daraja references.
	 *
	 * @param \WC_Order $order Order to charge.
	 * @param string    $phone Customer phone number.
	 * @return array|\WP_Error
	 */
	public function stk_push( $order, $phone ) {
		$token = $this->get_access_token();
		if ( is_wp_error( $token ) ) {
			return $token;
		}

		$normalized = $this->normalize_phone( $phone );
		if ( ! $normalized ) {
			return new \WP_Error( 'wsc_mpesa_phone', __( 'Please provide a valid Safaricom phone number.', 'walking-shadow-commerce' ) );
		}

		$creds = $this->credentials();
		if ( ! $creds['shortcode'] || ! WSC_Settings::get( 'passkey' ) ) {
			return new \WP_Error( 'wsc_mpesa_config', __( 'M-Pesa shortcode or passkey is not configured.', 'walking-shadow-commerce' ) );
		}

		$amount = (int) ceil( (float) $order->get_total() );
		if ( $amount < 1 ) {
			return new \WP_Error( 'wsc_mpesa_amount', __( 'Order total is not payable via M-Pesa.', 'walking-shadow-commerce' ) );
		}

		$payload = array(
			'BusinessShortCode' => $creds['shortcode'],
			'Password'          => $creds['password'],
			'Timestamp'         => $creds['timestamp'],
			'TransactionType'   => WSC_Settings::get( 'transaction_type' ),
			'Amount'            => $amount,
			'PartyA'            => $normalized,
			'PartyB'            => $creds['shortcode'],
			'PhoneNumber'       => $normalized,
			'CallBackURL'       => WSC_Settings::get( 'callback_url' ),
			'AccountReference'  => 'WSP-' . $order->get_order_number(),
			'TransactionDesc'   => 'Walking Shadow Poetry order ' . $order->get_order_number(),
		);

		$response = wp_remote_post(
			WSC_Settings::mpesa_base_url() . '/mpesa/stkpush/v1/processrequest',
			array(
				'timeout' => 30,
				'headers' => array(
					'Authorization' => 'Bearer ' . $token,
					'Content-Type'  => 'application/json',
					'Accept'        => 'application/json',
				),
				'body'    => wp_json_encode( $payload ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$body = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( empty( $body['CheckoutRequestID'] ) ) {
			$message = isset( $body['errorMessage'] ) ? $body['errorMessage'] : __( 'M-Pesa did not accept the payment request.', 'walking-shadow-commerce' );
			return new \WP_Error( 'wsc_mpesa_stk', $message );
		}

		$order->update_meta_data( '_wsc_mpesa_checkout_request_id', sanitize_text_field( $body['CheckoutRequestID'] ) );
		$order->update_meta_data( '_wsc_mpesa_merchant_request_id', sanitize_text_field( $body['MerchantRequestID'] ?? '' ) );
		$order->update_meta_data( '_wsc_mpesa_phone', $normalized );
		$order->update_meta_data( '_wsc_mpesa_state', 'pending' );
		$order->save();

		return array(
			'checkoutRequestId' => $body['CheckoutRequestID'],
			'customerMessage'   => $body['CustomerMessage'] ?? __( 'Enter your M-Pesa PIN to complete payment.', 'walking-shadow-commerce' ),
		);
	}

	/**
	 * Handles the asynchronous Daraja callback.
	 *
	 * @param \WP_REST_Request $request Callback request.
	 * @return \WP_REST_Response
	 */
	public function handle_callback( $request ) {
		$payload = $request->get_json_params();
		$stk     = isset( $payload['Body']['stkCallback'] ) ? $payload['Body']['stkCallback'] : array();

		if ( empty( $stk['CheckoutRequestID'] ) ) {
			return new \WP_REST_Response( array( 'ResultCode' => 1, 'ResultDesc' => 'Invalid payload' ), 200 );
		}

		$checkout_id = sanitize_text_field( $stk['CheckoutRequestID'] );
		$order       = $this->find_order_by_checkout_id( $checkout_id );

		if ( ! $order ) {
			return new \WP_REST_Response( array( 'ResultCode' => 0, 'ResultDesc' => 'Accepted' ), 200 );
		}

		$result_code = isset( $stk['ResultCode'] ) ? (int) $stk['ResultCode'] : -1;

		if ( 0 === $result_code ) {
			$meta    = isset( $stk['CallbackMetadata']['Item'] ) ? $stk['CallbackMetadata']['Item'] : array();
			$receipt = $this->extract_meta( $meta, 'MpesaReceiptNumber' );
			$amount  = (float) $this->extract_meta( $meta, 'Amount' );

			$order->update_meta_data( '_wsc_mpesa_receipt', sanitize_text_field( $receipt ) );
			$order->update_meta_data( '_wsc_mpesa_state', 'paid' );
			$order->add_order_note(
				sprintf(
					/* translators: 1: receipt number, 2: amount */
					__( 'M-Pesa payment confirmed. Receipt %1$s for KSh %2$s.', 'walking-shadow-commerce' ),
					$receipt ? $receipt : '—',
					number_format( $amount, 2 )
				)
			);

			if ( $amount >= (float) $order->get_total() - 0.01 ) {
				if ( ! $order->is_paid() ) {
					$order->payment_complete( $receipt );
				}
			} else {
				$order->update_status( 'on-hold', __( 'M-Pesa amount did not match the order total.', 'walking-shadow-commerce' ) );
			}
		} else {
			$desc = isset( $stk['ResultDesc'] ) ? sanitize_text_field( $stk['ResultDesc'] ) : __( 'Payment failed.', 'walking-shadow-commerce' );
			$order->update_meta_data( '_wsc_mpesa_state', 'failed' );
			$order->update_status( 'failed', sprintf( __( 'M-Pesa payment failed: %s', 'walking-shadow-commerce' ), $desc ) );
		}

		$order->save();

		return new \WP_REST_Response( array( 'ResultCode' => 0, 'ResultDesc' => 'Accepted' ), 200 );
	}

	/**
	 * Finds an order by its stored Daraja CheckoutRequestID.
	 *
	 * @param string $checkout_id CheckoutRequestID.
	 * @return \WC_Order|null
	 */
	private function find_order_by_checkout_id( $checkout_id ) {
		$orders = wc_get_orders(
			array(
				'limit'      => 1,
				'meta_key'   => '_wsc_mpesa_checkout_request_id', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
				'meta_value' => $checkout_id, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_value
				'return'     => 'objects',
			)
		);

		return ! empty( $orders ) ? $orders[0] : null;
	}

	/**
	 * Extracts a named value from a Daraja callback metadata array.
	 *
	 * @param array  $items Metadata items.
	 * @param string $name  Key to find.
	 * @return string
	 */
	private function extract_meta( $items, $name ) {
		if ( ! is_array( $items ) ) {
			return '';
		}
		foreach ( $items as $item ) {
			if ( isset( $item['Name'], $item['Value'] ) && $name === $item['Name'] ) {
				return (string) $item['Value'];
			}
		}
		return '';
	}
}

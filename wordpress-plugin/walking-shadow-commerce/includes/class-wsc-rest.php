<?php
/**
 * REST routes for M-Pesa initiation/status, commissions and newsletter.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers the storefront REST API surface under walkingshadow/v1.
 */
class WSC_Rest {

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Rest|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Rest
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
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		add_filter( 'rest_allowed_cors_origin', array( $this, 'allowed_origins' ) );
	}

	/**
	 * Allows the configured origin (and local dev) for cross-origin requests.
	 *
	 * @param array $origins Allowed origins.
	 * @return array
	 */
	public function allowed_origins( $origins ) {
		$configured = WSC_Settings::get( 'allowed_origin' );
		if ( $configured ) {
			$origins[] = untrailingslashit( $configured );
		}
		$origins[] = 'http://localhost:5173';
		$origins[] = 'http://localhost:4173';
		return array_values( array_unique( $origins ) );
	}

	/**
	 * Registers all plugin routes.
	 */
	public function register_routes() {
		register_rest_route(
			WSC_REST_NAMESPACE,
			'/mpesa/stk-push',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'stk_push' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			WSC_REST_NAMESPACE,
			'/mpesa/status',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'mpesa_status' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			WSC_REST_NAMESPACE,
			'/commissions',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'commissions' ),
				'permission_callback' => '__return_true',
			)
		);

		register_rest_route(
			WSC_REST_NAMESPACE,
			'/newsletter',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'newsletter' ),
				'permission_callback' => '__return_true',
			)
		);
	}

	/**
	 * Applies a simple per-IP rate limit.
	 *
	 * @param string $bucket  Bucket name.
	 * @param int    $seconds Window in seconds.
	 * @return true|\WP_Error
	 */
	private function rate_limit( $bucket, $seconds = null ) {
		$seconds = null === $seconds ? (int) WSC_Settings::get( 'rate_limit_seconds', 60 ) : (int) $seconds;
		if ( $seconds < 1 ) {
			return true;
		}

		$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
		$key = 'wsc_rl_' . $bucket . '_' . md5( $ip );

		if ( get_transient( $key ) ) {
			return new \WP_Error(
				'wsc_rate_limited',
				__( 'Too many requests. Please wait a moment and try again.', 'walking-shadow-commerce' ),
				array( 'status' => 429 )
			);
		}

		set_transient( $key, 1, $seconds );
		return true;
	}

	/**
	 * Initiates an STK push for an existing order.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function stk_push( $request ) {
		$limited = $this->rate_limit( 'stk', 15 );
		if ( is_wp_error( $limited ) ) {
			return $limited;
		}

		$order = $this->authorize_order( $request );
		if ( is_wp_error( $order ) ) {
			return $order;
		}

		if ( $order->is_paid() ) {
			return new \WP_REST_Response(
				array(
					'success' => true,
					'message' => __( 'This order has already been paid.', 'walking-shadow-commerce' ),
				),
				200
			);
		}

		$phone  = sanitize_text_field( (string) $request->get_param( 'phone' ) );
		$result = WSC_Mpesa::instance()->stk_push( $order, $phone );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return new \WP_REST_Response(
			array(
				'success'            => true,
				'message'            => __( 'An M-Pesa prompt has been sent to your phone.', 'walking-shadow-commerce' ),
				'checkout_request_id' => $result['checkoutRequestId'],
				'customer_message'    => $result['customerMessage'],
			),
			200
		);
	}

	/**
	 * Returns the current M-Pesa payment status for an order.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function mpesa_status( $request ) {
		$order = $this->authorize_order( $request );
		if ( is_wp_error( $order ) ) {
			return $order;
		}

		$paid  = $order->is_paid();
		$state = $order->get_meta( '_wsc_mpesa_state' );
		$status = 'pending';

		if ( $paid ) {
			$status = 'paid';
		} elseif ( 'failed' === $state || $order->has_status( 'failed' ) ) {
			$status = 'failed';
		} elseif ( $order->has_status( 'cancelled' ) ) {
			$status = 'cancelled';
		} elseif ( 'pending' === $state ) {
			$status = 'processing';
		}

		return new \WP_REST_Response(
			array(
				'order_id'     => $order->get_id(),
				'status'       => $status,
				'paid'         => $paid,
				'mpesa_receipt' => $order->get_meta( '_wsc_mpesa_receipt' ),
				'amount'       => (float) $order->get_total(),
			),
			200
		);
	}

	/**
	 * Creates a poetry commission from the storefront enquiry form.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function commissions( $request ) {
		$limited = $this->rate_limit( 'commission', 30 );
		if ( is_wp_error( $limited ) ) {
			return $limited;
		}

		$email = sanitize_email( (string) $request->get_param( 'email' ) );
		$name  = sanitize_text_field( (string) $request->get_param( 'customerName' ) );

		if ( ! $email || ! is_email( $email ) ) {
			return new \WP_Error( 'wsc_invalid_email', __( 'Please provide a valid email address.', 'walking-shadow-commerce' ), array( 'status' => 400 ) );
		}
		if ( '' === $name ) {
			return new \WP_Error( 'wsc_invalid_name', __( 'Please provide your name.', 'walking-shadow-commerce' ), array( 'status' => 400 ) );
		}

		$data = array(
			'name'        => $name,
			'email'       => $email,
			'phone'       => sanitize_text_field( (string) $request->get_param( 'phone' ) ),
			'poetry_type' => sanitize_text_field( (string) $request->get_param( 'poetryType' ) ),
			'length'      => sanitize_text_field( (string) $request->get_param( 'length' ) ),
			'occasion'    => sanitize_text_field( (string) $request->get_param( 'occasion' ) ),
			'delivery'    => sanitize_text_field( (string) $request->get_param( 'instructions' ) ),
			'details'     => sanitize_textarea_field(
				trim(
					(string) $request->get_param( 'theme' ) . "\n\n" .
					(string) $request->get_param( 'details' ) . "\n\nTone: " .
					(string) $request->get_param( 'tone' ) . "\nRecipient: " .
					(string) $request->get_param( 'recipient' )
				)
			),
		);

		$post_id = WSC_Commissions::instance()->create( $data );
		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		return new \WP_REST_Response(
			array(
				'success'       => true,
				'message'       => __( 'Your commission request has been received. We will be in touch shortly.', 'walking-shadow-commerce' ),
				'commission_id' => $post_id,
				'reference'     => get_post_meta( $post_id, '_wsc_reference', true ),
			),
			201
		);
	}

	/**
	 * Subscribes an email address to the newsletter.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function newsletter( $request ) {
		$limited = $this->rate_limit( 'newsletter', 10 );
		if ( is_wp_error( $limited ) ) {
			return $limited;
		}

		$email = sanitize_email( (string) $request->get_param( 'email' ) );
		if ( ! $email || ! is_email( $email ) ) {
			return new \WP_Error( 'wsc_invalid_email', __( 'Please provide a valid email address.', 'walking-shadow-commerce' ), array( 'status' => 400 ) );
		}

		WSC_Newsletter::instance()->subscribe( $email );

		return new \WP_REST_Response(
			array(
				'success' => true,
				'message' => __( 'Thank you for subscribing.', 'walking-shadow-commerce' ),
			),
			200
		);
	}

	/**
	 * Resolves and validates the order referenced by the request.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WC_Order|\WP_Error
	 */
	private function authorize_order( $request ) {
		$order_id  = absint( $request->get_param( 'order_id' ) );
		$order_key = sanitize_text_field( (string) $request->get_param( 'order_key' ) );

		if ( ! $order_id ) {
			return new \WP_Error( 'wsc_missing_order', __( 'An order is required.', 'walking-shadow-commerce' ), array( 'status' => 400 ) );
		}

		$order = wc_get_order( $order_id );
		if ( ! $order ) {
			return new \WP_Error( 'wsc_order_not_found', __( 'Order not found.', 'walking-shadow-commerce' ), array( 'status' => 404 ) );
		}

		if ( ! $order_key || ! hash_equals( (string) $order->get_order_key(), $order_key ) ) {
			return new \WP_Error( 'wsc_order_forbidden', __( 'This order cannot be accessed.', 'walking-shadow-commerce' ), array( 'status' => 403 ) );
		}

		return $order;
	}
}

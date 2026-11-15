<?php
/**
 * Persists personalized-item details submitted through the Store API.
 *
 * The React storefront sends a `ws_personalization` object alongside the
 * Store API add-item request. We validate and store it as cart item data, then
 * copy it onto the order line item at checkout.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles personalization payloads for cart and order items.
 */
class WSC_Personalization {

	const CART_KEY   = 'ws_personalization';
	const META_KEY   = '_ws_personalization';
	const MAX_LENGTH = 2000;

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Personalization|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Personalization
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
		add_filter( 'woocommerce_store_api_add_to_cart_data', array( $this, 'attach_cart_data' ), 10, 2 );
		add_filter( 'woocommerce_get_item_data', array( $this, 'display_item_data' ), 10, 2 );
		add_action( 'woocommerce_checkout_create_order_line_item', array( $this, 'persist_to_order_item' ), 10, 4 );
	}

	/**
	 * Attaches sanitized personalization data to the Store API add-to-cart payload.
	 *
	 * @param array            $data    Product data passed to WC()->cart->add_to_cart().
	 * @param \WP_REST_Request $request The incoming Store API request.
	 * @return array
	 */
	public function attach_cart_data( $data, $request ) {
		if ( ! is_object( $request ) || ! method_exists( $request, 'get_param' ) ) {
			return $data;
		}

		$raw = $request->get_param( self::CART_KEY );
		if ( empty( $raw ) ) {
			return $data;
		}

		$sanitized = $this->sanitize( $raw );
		if ( empty( $sanitized ) ) {
			return $data;
		}

		$data[ self::CART_KEY ] = $sanitized;
		return $data;
	}

	/**
	 * Sanitizes an arbitrary personalization payload into a flat string map.
	 *
	 * @param mixed $raw Raw payload.
	 * @return array
	 */
	public function sanitize( $raw ) {
		if ( is_string( $raw ) ) {
			$decoded = json_decode( $raw, true );
			$raw     = is_array( $decoded ) ? $decoded : array( 'notes' => $raw );
		}

		if ( ! is_array( $raw ) ) {
			return array();
		}

		$clean = array();
		foreach ( $raw as $key => $value ) {
			if ( is_array( $value ) || is_object( $value ) ) {
				continue;
			}
			$key = sanitize_key( $key );
			if ( '' === $key ) {
				continue;
			}
			$value = sanitize_textarea_field( (string) $value );
			$value = function_exists( 'mb_substr' ) ? mb_substr( $value, 0, self::MAX_LENGTH ) : substr( $value, 0, self::MAX_LENGTH );
			if ( '' !== $value ) {
				$clean[ $key ] = $value;
			}
		}

		return $clean;
	}

	/**
	 * Human-readable labels for known personalization keys.
	 *
	 * @return array
	 */
	private function labels() {
		return array(
			'recipient'   => __( 'Recipient', 'walking-shadow-commerce' ),
			'occasion'    => __( 'Occasion', 'walking-shadow-commerce' ),
			'tone'        => __( 'Tone', 'walking-shadow-commerce' ),
			'length'      => __( 'Length', 'walking-shadow-commerce' ),
			'delivery'    => __( 'Delivery format', 'walking-shadow-commerce' ),
			'poetry_type' => __( 'Poetry type', 'walking-shadow-commerce' ),
			'notes'       => __( 'Personal message', 'walking-shadow-commerce' ),
		);
	}

	/**
	 * Surfaces personalization data in cart and checkout line items.
	 *
	 * @param array $item_data Existing display data.
	 * @param array $cart_item Cart item.
	 * @return array
	 */
	public function display_item_data( $item_data, $cart_item ) {
		if ( empty( $cart_item[ self::CART_KEY ] ) || ! is_array( $cart_item[ self::CART_KEY ] ) ) {
			return $item_data;
		}

		$labels = $this->labels();
		foreach ( $cart_item[ self::CART_KEY ] as $key => $value ) {
			$item_data[] = array(
				'key'   => isset( $labels[ $key ] ) ? $labels[ $key ] : ucwords( str_replace( '_', ' ', $key ) ),
				'value' => $value,
			);
		}

		return $item_data;
	}

	/**
	 * Copies personalization data onto the order line item at checkout.
	 *
	 * @param \WC_Order_Item_Product $item          Order line item.
	 * @param string                 $cart_item_key Cart item key.
	 * @param array                  $values        Cart item values.
	 * @param \WC_Order              $order         Order object.
	 */
	public function persist_to_order_item( $item, $cart_item_key, $values, $order ) {
		if ( empty( $values[ self::CART_KEY ] ) || ! is_array( $values[ self::CART_KEY ] ) ) {
			return;
		}

		$labels = $this->labels();
		$item->add_meta_data( self::META_KEY, $values[ self::CART_KEY ] );

		foreach ( $values[ self::CART_KEY ] as $key => $value ) {
			$label = isset( $labels[ $key ] ) ? $labels[ $key ] : ucwords( str_replace( '_', ' ', $key ) );
			$item->add_meta_data( $label, $value );
		}
	}
}

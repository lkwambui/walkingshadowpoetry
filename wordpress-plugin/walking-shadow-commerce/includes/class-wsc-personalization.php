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

	const CART_KEY    = 'ws_personalization';
	const META_KEY    = '_ws_personalization';
	const META_PREFIX = 'ws_';
	const MAX_LENGTH  = 3000;

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
		add_filter( 'woocommerce_order_item_display_meta_key', array( $this, 'display_meta_key' ), 10, 3 );
		add_filter( 'woocommerce_email_order_meta_fields', array( $this, 'email_meta_fields' ), 10, 3 );
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

		if ( ! $this->validate( $sanitized ) ) {
			throw new \WC_REST_Exception(
				'ws_personalization_invalid',
				__( 'Please complete all required personalization details before adding this piece.', 'walking-shadow-commerce' ),
				400
			);
		}

		if ( ! isset( $data['cart_item_data'] ) || ! is_array( $data['cart_item_data'] ) ) {
			$data['cart_item_data'] = array();
		}

		$data['cart_item_data'][ self::CART_KEY ] = $sanitized;
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

		$clean  = array();
		$limits = $this->limits();

		foreach ( $limits as $key => $limit ) {
			if ( ! array_key_exists( $key, $raw ) ) {
				continue;
			}

			$value = $raw[ $key ];
			if ( is_array( $value ) || is_object( $value ) || null === $value ) {
				continue;
			}

			$value = wp_unslash( (string) $value );
			$value = 'customerEmail' === $key ? sanitize_email( $value ) : sanitize_textarea_field( $value );
			$value = trim( preg_replace( '/[\r\n]+/', "\n", $value ) );
			$value = function_exists( 'mb_substr' ) ? mb_substr( $value, 0, $limit ) : substr( $value, 0, $limit );

			if ( '' !== $value ) {
				$clean[ $key ] = $value;
			}
		}

		return $clean;
	}

	private function limits() {
		return array(
			'productKind'      => 40,
			'customerName'     => 100,
			'customerEmail'    => 160,
			'customerPhone'    => 40,
			'recipientName'    => 120,
			'relationship'     => 80,
			'pronunciation'    => 120,
			'occasion'         => 120,
			'message'          => 1200,
			'story'            => 3000,
			'memories'         => 2000,
			'importantDetails' => 1500,
			'poeticStyle'      => 120,
			'tone'             => 120,
			'length'           => 120,
			'instructions'     => 1500,
			'surprise'         => 10,
			'preferredDate'    => 20,
			'dedication'       => 10,
			'dedicationText'   => 500,
			'privatePoem'      => 10,
			'deliveryFormat'   => 120,
			'theme'            => 200,
			'keyDetails'       => 2000,
		);
	}

	private function validate( $data ) {
		$required = array(
			'productKind',
			'customerName',
			'customerEmail',
			'recipientName',
			'relationship',
			'occasion',
			'message',
			'story',
			'poeticStyle',
			'tone',
			'length',
			'deliveryFormat',
			'surprise',
			'dedication',
			'privatePoem',
		);

		foreach ( $required as $key ) {
			if ( empty( $data[ $key ] ) ) {
				return false;
			}
		}

		if ( ! in_array( $data['productKind'], array( 'customized-note', 'commissioned-poem' ), true ) ) {
			return false;
		}

		if ( ! is_email( $data['customerEmail'] ) ) {
			return false;
		}

		$message_length = function_exists( 'mb_strlen' ) ? mb_strlen( $data['message'] ) : strlen( $data['message'] );
		$story_length   = function_exists( 'mb_strlen' ) ? mb_strlen( $data['story'] ) : strlen( $data['story'] );
		if ( $message_length < 20 || $story_length < 30 ) {
			return false;
		}

		foreach ( array( 'surprise', 'dedication', 'privatePoem' ) as $choice ) {
			if ( ! in_array( $data[ $choice ], array( 'yes', 'no' ), true ) ) {
				return false;
			}
		}

		if ( 'yes' === $data['dedication'] && empty( $data['dedicationText'] ) ) {
			return false;
		}

		if ( ! empty( $data['preferredDate'] ) && ! preg_match( '/^\d{4}-\d{2}-\d{2}$/', $data['preferredDate'] ) ) {
			return false;
		}

		if ( 0 === strpos( $data['occasion'], 'Other:' ) && '' === trim( substr( $data['occasion'], 6 ) ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Human-readable labels for known personalization keys.
	 *
	 * @return array
	 */
	private function labels() {
		return array(
			'productKind'      => __( 'Piece type', 'walking-shadow-commerce' ),
			'customerName'     => __( 'Your name', 'walking-shadow-commerce' ),
			'customerEmail'    => __( 'Your email', 'walking-shadow-commerce' ),
			'customerPhone'    => __( 'Contact number', 'walking-shadow-commerce' ),
			'recipientName'    => __( 'Recipient', 'walking-shadow-commerce' ),
			'relationship'     => __( 'Relationship', 'walking-shadow-commerce' ),
			'pronunciation'    => __( 'Preferred name / pronunciation', 'walking-shadow-commerce' ),
			'occasion'         => __( 'Occasion', 'walking-shadow-commerce' ),
			'message'          => __( 'What it should communicate', 'walking-shadow-commerce' ),
			'story'            => __( 'Personal story', 'walking-shadow-commerce' ),
			'memories'         => __( 'Special memories', 'walking-shadow-commerce' ),
			'importantDetails' => __( 'Details to include', 'walking-shadow-commerce' ),
			'poeticStyle'      => __( 'Poetic style', 'walking-shadow-commerce' ),
			'tone'             => __( 'Tone', 'walking-shadow-commerce' ),
			'length'           => __( 'Length', 'walking-shadow-commerce' ),
			'instructions'     => __( 'Additional instructions', 'walking-shadow-commerce' ),
			'surprise'         => __( 'Surprise gift', 'walking-shadow-commerce' ),
			'preferredDate'    => __( 'Preferred delivery date', 'walking-shadow-commerce' ),
			'dedication'       => __( 'Dedication', 'walking-shadow-commerce' ),
			'dedicationText'   => __( 'Dedication wording', 'walking-shadow-commerce' ),
			'privatePoem'      => __( 'Keep private', 'walking-shadow-commerce' ),
			'deliveryFormat'   => __( 'Delivery format', 'walking-shadow-commerce' ),
			'theme'            => __( 'Message theme', 'walking-shadow-commerce' ),
			'keyDetails'       => __( 'Key details', 'walking-shadow-commerce' ),
		);
	}

	private function label_for( $key ) {
		$labels = $this->labels();
		return isset( $labels[ $key ] ) ? $labels[ $key ] : ucwords( str_replace( '_', ' ', $key ) );
	}

	private function meta_key_for( $key ) {
		$suffix = preg_replace( '/(?<!^)[A-Z]/', '_$0', $key );
		return self::META_PREFIX . strtolower( preg_replace( '/[^a-zA-Z0-9_]/', '_', $suffix ) );
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

		foreach ( $cart_item[ self::CART_KEY ] as $key => $value ) {
			$item_data[] = array(
				'key'      => $this->label_for( $key ),
				'value'    => $value,
				'raw_key'  => $key,
				'display'  => $this->label_for( $key ) . ': ' . $value,
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

		$item->add_meta_data( self::META_KEY, $values[ self::CART_KEY ] );

		foreach ( $values[ self::CART_KEY ] as $key => $value ) {
			$item->add_meta_data( $this->meta_key_for( $key ), $value );
		}
	}

	public function display_meta_key( $display_key, $meta, $item ) {
		if ( ! is_object( $meta ) || empty( $meta->key ) || 0 !== strpos( $meta->key, self::META_PREFIX ) ) {
			return $display_key;
		}

		foreach ( $this->labels() as $key => $label ) {
			if ( $this->meta_key_for( $key ) === $meta->key ) {
				return $label;
			}
		}

		return $display_key;
	}

	public function email_meta_fields( $fields, $sent_to_admin, $order ) {
		if ( ! is_object( $order ) || ! method_exists( $order, 'get_items' ) ) {
			return $fields;
		}

		foreach ( $order->get_items() as $item ) {
			if ( ! method_exists( $item, 'get_meta' ) ) {
				continue;
			}

			$data = $item->get_meta( self::META_KEY, true );
			if ( empty( $data ) || ! is_array( $data ) ) {
				continue;
			}

			$lines = array();
			foreach ( $data as $key => $value ) {
				$lines[] = $this->label_for( $key ) . ': ' . $value;
			}

			$fields[ 'ws_personalization_' . $item->get_id() ] = array(
				'label' => sprintf( __( 'Personalization — %s', 'walking-shadow-commerce' ), $item->get_name() ),
				'value' => implode( "\n", $lines ),
			);
		}

		return $fields;
	}
}

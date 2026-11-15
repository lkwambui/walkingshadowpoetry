<?php
/**
 * Poetry commission management: custom post type, statuses and admin UI.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Registers and manages commissioned-poetry requests.
 */
class WSC_Commissions {

	const POST_TYPE = 'ws_commission';
	const TAXONOMY  = 'wsc_commission_status';

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Commissions|null
	 */
	private static $instance = null;

	/**
	 * Default workflow statuses.
	 *
	 * @return array
	 */
	public static function default_statuses() {
		return array(
			'received'        => __( 'Received', 'walking-shadow-commerce' ),
			'under-review'    => __( 'Under Review', 'walking-shadow-commerce' ),
			'awaiting-payment' => __( 'Awaiting Payment', 'walking-shadow-commerce' ),
			'in-progress'     => __( 'In Progress', 'walking-shadow-commerce' ),
			'completed'       => __( 'Completed', 'walking-shadow-commerce' ),
			'delivered'       => __( 'Delivered', 'walking-shadow-commerce' ),
			'cancelled'       => __( 'Cancelled', 'walking-shadow-commerce' ),
		);
	}

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Commissions
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
		add_action( 'init', array( __CLASS__, 'register_post_type' ) );
		add_action( 'init', array( __CLASS__, 'register_taxonomy' ) );
		add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ) );
		add_action( 'save_post_' . self::POST_TYPE, array( $this, 'save_meta' ) );
		add_filter( 'manage_' . self::POST_TYPE . '_posts_columns', array( $this, 'columns' ) );
		add_action( 'manage_' . self::POST_TYPE . '_posts_custom_column', array( $this, 'column_content' ), 10, 2 );
		add_filter( 'manage_edit-' . self::POST_TYPE . '_sortable_columns', array( $this, 'sortable_columns' ) );
	}

	/**
	 * Registers the commission post type.
	 */
	public static function register_post_type() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'          => array(
					'name'          => __( 'Commissions', 'walking-shadow-commerce' ),
					'singular_name' => __( 'Commission', 'walking-shadow-commerce' ),
					'add_new_item'  => __( 'Add Commission', 'walking-shadow-commerce' ),
					'edit_item'     => __( 'Edit Commission', 'walking-shadow-commerce' ),
					'search_items'  => __( 'Search Commissions', 'walking-shadow-commerce' ),
				),
				'public'          => false,
				'show_ui'         => true,
				'show_in_menu'    => 'wsc-settings',
				'menu_icon'       => 'dashicons-edit-page',
				'supports'        => array( 'title', 'editor' ),
				'capability_type' => 'post',
				'map_meta_cap'    => true,
			)
		);
	}

	/**
	 * Registers the commission status taxonomy.
	 */
	public static function register_taxonomy() {
		register_taxonomy(
			self::TAXONOMY,
			self::POST_TYPE,
			array(
				'labels'       => array(
					'name'          => __( 'Commission Statuses', 'walking-shadow-commerce' ),
					'singular_name' => __( 'Commission Status', 'walking-shadow-commerce' ),
				),
				'public'       => false,
				'show_ui'      => true,
				'show_in_menu' => false,
				'hierarchical' => true,
				'rewrite'      => false,
			)
		);
	}

	/**
	 * Seeds the default status terms.
	 */
	public static function seed_statuses() {
		self::register_taxonomy();
		foreach ( self::default_statuses() as $slug => $label ) {
			if ( ! term_exists( $slug, self::TAXONOMY ) ) {
				wp_insert_term( $label, self::TAXONOMY, array( 'slug' => $slug ) );
			}
		}
	}

	/**
	 * Registers the detail meta box.
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'wsc_commission_details',
			__( 'Commission Details', 'walking-shadow-commerce' ),
			array( $this, 'render_meta_box' ),
			self::POST_TYPE,
			'normal',
			'high'
		);
	}

	/**
	 * Fields captured from the storefront commission form.
	 *
	 * @return array
	 */
	private function fields() {
		return array(
			'name'           => __( 'Name', 'walking-shadow-commerce' ),
			'email'          => __( 'Email', 'walking-shadow-commerce' ),
			'phone'          => __( 'Phone', 'walking-shadow-commerce' ),
			'poetry_type'    => __( 'Poetry Type', 'walking-shadow-commerce' ),
			'length'         => __( 'Length', 'walking-shadow-commerce' ),
			'occasion'       => __( 'Occasion', 'walking-shadow-commerce' ),
			'delivery'       => __( 'Delivery Format', 'walking-shadow-commerce' ),
			'deadline'       => __( 'Deadline', 'walking-shadow-commerce' ),
			'reference'      => __( 'Reference', 'walking-shadow-commerce' ),
			'details'        => __( 'Details', 'walking-shadow-commerce' ),
		);
	}

	/**
	 * Renders the meta box.
	 *
	 * @param \WP_Post $post Post object.
	 */
	public function render_meta_box( $post ) {
		wp_nonce_field( 'wsc_commission_save', 'wsc_commission_nonce' );
		echo '<table class="form-table" role="presentation"><tbody>';
		foreach ( $this->fields() as $key => $label ) {
			$value = get_post_meta( $post->ID, '_wsc_' . $key, true );
			printf( '<tr><th scope="row">%s</th><td>', esc_html( $label ) );
			if ( 'details' === $key ) {
				printf( '<textarea name="wsc_%s" rows="6" class="large-text">%s</textarea>', esc_attr( $key ), esc_textarea( $value ) );
			} else {
				printf( '<input type="text" name="wsc_%s" value="%s" class="regular-text" />', esc_attr( $key ), esc_attr( $value ) );
			}
			echo '</td></tr>';
		}
		echo '</tbody></table>';
	}

	/**
	 * Saves meta box values.
	 *
	 * @param int $post_id Post ID.
	 */
	public function save_meta( $post_id ) {
		if ( ! isset( $_POST['wsc_commission_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['wsc_commission_nonce'] ) ), 'wsc_commission_save' ) ) {
			return;
		}
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		foreach ( array_keys( $this->fields() ) as $key ) {
			$input_key = 'wsc_' . $key;
			if ( ! isset( $_POST[ $input_key ] ) ) {
				continue;
			}
			$raw   = wp_unslash( $_POST[ $input_key ] ); // phpcs:ignore WordPress.Security.ValidatedSanitizedInput
			$value = ( 'details' === $key ) ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw );
			update_post_meta( $post_id, '_wsc_' . $key, $value );
		}
	}

	/**
	 * Creates a commission record from a validated payload.
	 *
	 * @param array $data Sanitized fields.
	 * @return int|\WP_Error
	 */
	public function create( $data ) {
		$reference = isset( $data['reference'] ) && $data['reference'] ? $data['reference'] : 'WSP-' . strtoupper( wp_generate_password( 6, false, false ) );
		$title     = sprintf( '%s — %s', $data['name'] ?? __( 'Commission', 'walking-shadow-commerce' ), $reference );

		$post_id = wp_insert_post(
			array(
				'post_type'   => self::POST_TYPE,
				'post_status' => 'publish',
				'post_title'  => $title,
			),
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$data['reference'] = $reference;
		foreach ( $this->fields() as $key => $label ) {
			if ( isset( $data[ $key ] ) ) {
				update_post_meta( $post_id, '_wsc_' . $key, $data[ $key ] );
			}
		}

		wp_set_object_terms( $post_id, 'received', self::TAXONOMY );

		$this->notify( $data, $post_id );

		return $post_id;
	}

	/**
	 * Notifies the studio and the requester about a new commission.
	 *
	 * @param array $data    Commission data.
	 * @param int   $post_id Post ID.
	 */
	private function notify( $data, $post_id ) {
		$admin_email = WSC_Settings::get( 'notification_email', get_option( 'admin_email' ) );

		$admin_body = sprintf(
			"A new poetry commission was received.\n\nReference: %s\nName: %s\nEmail: %s\nPhone: %s\nType: %s\nLength: %s\nOccasion: %s\nDelivery: %s\nDeadline: %s\n\nDetails:\n%s\n\nEdit: %s",
			$data['reference'],
			$data['name'] ?? '',
			$data['email'] ?? '',
			$data['phone'] ?? '',
			$data['poetry_type'] ?? '',
			$data['length'] ?? '',
			$data['occasion'] ?? '',
			$data['delivery'] ?? '',
			$data['deadline'] ?? '',
			$data['details'] ?? '',
			get_edit_post_link( $post_id, '' )
		);
		wp_mail( $admin_email, 'New poetry commission ' . $data['reference'], $admin_body );

		if ( ! empty( $data['email'] ) && is_email( $data['email'] ) ) {
			$customer_body = sprintf(
				"Thank you for commissioning a poem from Walking Shadow Poetry.\n\nWe have received your request and will be in touch shortly.\n\nYour reference: %s\n\nWith warmth,\nWalking Shadow Poetry",
				$data['reference']
			);
			wp_mail( $data['email'], 'We received your poetry commission ' . $data['reference'], $customer_body );
		}
	}

	/**
	 * Adds custom admin columns.
	 *
	 * @param array $columns Existing columns.
	 * @return array
	 */
	public function columns( $columns ) {
		$columns['wsc_status'] = __( 'Status', 'walking-shadow-commerce' );
		$columns['wsc_email']  = __( 'Email', 'walking-shadow-commerce' );
		$columns['wsc_type']   = __( 'Type', 'walking-shadow-commerce' );
		return $columns;
	}

	/**
	 * Renders custom admin column content.
	 *
	 * @param string $column  Column key.
	 * @param int    $post_id Post ID.
	 */
	public function column_content( $column, $post_id ) {
		switch ( $column ) {
			case 'wsc_status':
				$terms = get_the_terms( $post_id, self::TAXONOMY );
				echo esc_html( ! empty( $terms ) && ! is_wp_error( $terms ) ? $terms[0]->name : '—' );
				break;
			case 'wsc_email':
				echo esc_html( get_post_meta( $post_id, '_wsc_email', true ) );
				break;
			case 'wsc_type':
				echo esc_html( get_post_meta( $post_id, '_wsc_poetry_type', true ) );
				break;
		}
	}

	/**
	 * Makes the email column sortable.
	 *
	 * @param array $columns Sortable columns.
	 * @return array
	 */
	public function sortable_columns( $columns ) {
		$columns['wsc_email'] = 'wsc_email';
		return $columns;
	}
}

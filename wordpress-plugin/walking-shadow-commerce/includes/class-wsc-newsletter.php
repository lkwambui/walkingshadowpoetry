<?php
/**
 * Newsletter subscriptions stored as a lightweight subscriber list.
 *
 * @package WalkingShadowCommerce
 */

defined( 'ABSPATH' ) || exit;

/**
 * Handles newsletter subscriptions and an admin overview.
 */
class WSC_Newsletter {

	const OPTION = 'wsc_subscribers';

	/**
	 * Singleton instance.
	 *
	 * @var WSC_Newsletter|null
	 */
	private static $instance = null;

	/**
	 * Returns the singleton instance.
	 *
	 * @return WSC_Newsletter
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
	}

	/**
	 * Returns all subscribers.
	 *
	 * @return array
	 */
	public function all() {
		$subscribers = get_option( self::OPTION, array() );
		return is_array( $subscribers ) ? $subscribers : array();
	}

	/**
	 * Adds a subscriber, deduplicating by email.
	 *
	 * @param string $email Email address.
	 * @param string $name  Optional name.
	 * @return bool True when newly added, false when already present.
	 */
	public function subscribe( $email, $name = '' ) {
		$email = sanitize_email( $email );
		if ( ! is_email( $email ) ) {
			return false;
		}

		$subscribers = $this->all();
		foreach ( $subscribers as $existing ) {
			if ( strtolower( $existing['email'] ) === strtolower( $email ) ) {
				return false;
			}
		}

		$subscribers[] = array(
			'email'  => $email,
			'name'   => sanitize_text_field( $name ),
			'date'   => current_time( 'mysql' ),
		);
		update_option( self::OPTION, $subscribers );

		return true;
	}

	/**
	 * Adds the subscribers admin page.
	 */
	public function add_menu() {
		add_submenu_page(
			'wsc-settings',
			__( 'Newsletter', 'walking-shadow-commerce' ),
			__( 'Newsletter', 'walking-shadow-commerce' ),
			'manage_options',
			'wsc-newsletter',
			array( $this, 'render_page' )
		);
	}

	/**
	 * Renders the subscribers list.
	 */
	public function render_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$subscribers = $this->all();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Newsletter Subscribers', 'walking-shadow-commerce' ); ?></h1>
			<p><?php printf( esc_html__( '%d subscriber(s).', 'walking-shadow-commerce' ), count( $subscribers ) ); ?></p>
			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Email', 'walking-shadow-commerce' ); ?></th>
						<th><?php esc_html_e( 'Name', 'walking-shadow-commerce' ); ?></th>
						<th><?php esc_html_e( 'Subscribed', 'walking-shadow-commerce' ); ?></th>
					</tr>
				</thead>
				<tbody>
				<?php if ( empty( $subscribers ) ) : ?>
					<tr><td colspan="3"><?php esc_html_e( 'No subscribers yet.', 'walking-shadow-commerce' ); ?></td></tr>
				<?php else : ?>
					<?php foreach ( $subscribers as $subscriber ) : ?>
						<tr>
							<td><?php echo esc_html( $subscriber['email'] ); ?></td>
							<td><?php echo esc_html( $subscriber['name'] ?? '' ); ?></td>
							<td><?php echo esc_html( $subscriber['date'] ?? '' ); ?></td>
						</tr>
					<?php endforeach; ?>
				<?php endif; ?>
				</tbody>
			</table>
		</div>
		<?php
	}
}

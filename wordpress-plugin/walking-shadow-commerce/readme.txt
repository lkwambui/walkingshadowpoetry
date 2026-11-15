=== Walking Shadow Commerce ===
Contributors: walkingshadowpoetry
Tags: woocommerce, mpesa, daraja, headless, commissions
Requires at least: 6.2
Tested up to: 6.7
Requires PHP: 7.4
WC requires at least: 7.0
WC tested up to: 9.9
Stable tag: 1.0.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Commerce backend for the Walking Shadow Poetry headless storefront: M-Pesa
(Daraja) payments, poetry commission management, personalized-item persistence
and a newsletter endpoint, on top of WooCommerce.

== Description ==

This plugin powers the server-side commerce features that the React storefront
cannot implement safely in the browser:

* **M-Pesa (Daraja) payments** — registers a WooCommerce payment gateway
  (`walkingshadow_mpesa`) and a REST route that triggers an STK push. Payment
  is only confirmed by the validated Safaricom callback, never by the client.
* **Personalized items** — accepts a `ws_personalization` object on Store API
  add-to-cart requests and stores it on the cart line and order item.
* **Poetry commissions** — a `ws_commission` post type with a status workflow
  (Received, Under Review, Awaiting Payment, In Progress, Completed, Delivered,
  Cancelled) and admin management, created from the storefront enquiry form.
* **Newsletter** — a lightweight subscriber list with an admin overview.

== Installation ==

1. Copy the `walking-shadow-commerce` folder into `wp-content/plugins/`
   (for this site: `/shop/wp-content/plugins/`).
2. Activate **Walking Shadow Commerce** in the WordPress admin.
3. Open **Walking Shadow** in the admin menu and enter your Daraja credentials.
4. Enable **M-Pesa (Daraja)** under WooCommerce → Settings → Payments.

== REST API ==

Namespace: `walkingshadow/v1`

* `POST /mpesa/stk-push` — body `{ order_id, order_key, phone }`
* `GET  /mpesa/status`   — query `order_id`, `order_key`
* `POST /mpesa/callback` — Safaricom callback (public, validated)
* `POST /commissions`    — poetry commission enquiry
* `POST /newsletter`     — newsletter subscription

== Changelog ==

= 1.0.0 =
* Initial release.

# Walking Shadow Commerce plugin setup

The `walking-shadow-commerce` WordPress plugin provides the server-side
commerce features the storefront cannot safely do in the browser.

Location: `wordpress-plugin/walking-shadow-commerce/`
Target install: `/shop/wp-content/plugins/walking-shadow-commerce/`

## What it provides

| Feature | Detail |
| --- | --- |
| M-Pesa payment gateway | WooCommerce gateway `walkingshadow_mpesa` |
| M-Pesa STK push + status | REST routes under `walkingshadow/v1` |
| Validated Daraja callback | Confirms payment server-side only |
| Personalized items | Persists `ws_personalization` to cart + order item |
| Poetry commissions | `ws_commission` post type with status workflow |
| Newsletter | Subscriber list with admin overview |

## Installation

1. Upload the `walking-shadow-commerce` folder to
   `/shop/wp-content/plugins/`.
2. Activate **Walking Shadow Commerce** in `/shop/wp-admin`.
   Activation registers the commission post type, seeds statuses and defaults.
3. Go to **Walking Shadow** in the admin menu and fill in the settings.
4. Go to **WooCommerce → Settings → Payments** and enable **M-Pesa (Daraja)**.

## Plugin settings

| Setting | Description |
| --- | --- |
| Environment | `sandbox` or `production` (selects the Daraja base URL). |
| Daraja Consumer Key / Secret | From your Safaricom Daraja app. |
| Business Shortcode | Your Paybill or Till number. |
| Lipa na M-Pesa Passkey | From Daraja. |
| Transaction Type | `CustomerPayBillOnline` (Paybill) or `CustomerBuyGoodsOnline` (Till). |
| Callback URL | Defaults to `/shop/wp-json/walkingshadow/v1/mpesa/callback`. Must be publicly reachable over HTTPS. |
| Notification Email | Receives new-commission alerts. |
| Allowed CORS Origin | Storefront origin (defaults to the site URL). Localhost dev ports are always allowed. |
| Rate Limit (seconds) | Minimum interval between public write requests per IP. |

## M-Pesa flow

1. Customer submits the checkout form (React).
2. React places the order via the Store API with
   `payment_method: walkingshadow_mpesa`. The gateway sets the order to
   **on-hold**.
3. React calls `POST /mpesa/stk-push` with the order id, key and phone.
4. The plugin obtains a Daraja OAuth token (cached), builds the Lipa na M-Pesa
   password, and calls `stkpush/v1/processrequest`. The `CheckoutRequestID` is
   stored on the order.
5. The customer approves on their phone.
6. Safaricom calls `POST /mpesa/callback`. The plugin matches the order, checks
   the amount, stores the receipt and calls `payment_complete()`.
7. React polls `GET /mpesa/status` and shows the confirmation.

Payment is **only** confirmed by step 6. The browser can never mark an order
paid.

## Commission workflow

Statuses (taxonomy `wsc_commission_status`):

`Received → Under Review → Awaiting Payment → In Progress → Completed → Delivered`
(with `Cancelled` available at any point).

Commissions are created from the storefront enquiry form, which posts to
`POST /commissions`. The plugin stores the details as post meta, emails the
studio and the requester, and exposes an editable record under
**Walking Shadow → Commissions**.

## Data and privacy

* M-Pesa credentials are stored in the `wsc_settings` option and never exposed
  to the frontend.
* The plugin stores no card or PIN data.
* Newsletter subscribers are stored in the `wsc_subscribers` option and listed
  under **Walking Shadow → Newsletter**.
* On uninstall, options and rate-limit transients are removed; commission posts
  are preserved so no client work is lost.

## Requirements

* WordPress 6.2+
* WooCommerce 7.0+ (tested to 9.9)
* PHP 7.4+
* HPOS (High-Performance Order Storage) compatible — declared on load.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Gateway not visible at checkout | Credentials set? Gateway enabled under WooCommerce → Payments? |
| `stk-push` returns 403 | `order_key` does not match the order. |
| Callback never confirms | Callback URL is not publicly reachable, or the order amount differs from the paid amount. |
| 429 responses | Per-IP rate limit; raise the interval in settings. |

# Storefront API integration

The storefront talks to two backends:

1. **WooCommerce Store API** (`/shop/wp-json/wc/store/v1`) — the authoritative
   source for catalog, cart, checkout, stock and orders. Public, no auth.
2. **Walking Shadow Commerce plugin** (`/shop/wp-json/walkingshadow/v1`) —
   M-Pesa payments, poetry commissions and the newsletter. Public routes with
   server-side rate limiting.

A third, read-only integration to the content install
(`/blog/wp-json/wp/v2`) serves journal and episode content and is unchanged.

## WooCommerce Store API

Base: `VITE_STORE_API_URL`. Client: `react-app/src/services/storeApi.ts`.

| Operation | Endpoint |
| --- | --- |
| List products | `GET /products` |
| Product by slug | `GET /products?slug=…` |
| Product by id | `GET /products/{id}` |
| Variations | `GET /products/{id}/variations` |
| Categories | `GET /products/categories` |
| Attributes | `GET /products/attributes` |
| Cart | `GET /cart` |
| Add item | `POST /cart/add-item` |
| Update item | `POST /cart/update-item` |
| Remove item | `POST /cart/remove-item` |
| Update customer | `POST /cart/update-customer` |
| Select shipping rate | `POST /cart/select-shipping-rate` |
| Apply coupon | `POST /cart/apply-coupon` |
| Checkout | `POST /checkout` |
| Order | `GET /order/{id}` |

### Cart session

The Store API is stateless. The client persists the `Cart-Token` response header
and sends it back on every cart request; `Nonce` is stored for write requests.
This is handled transparently in `storeApi.ts`.

### Prices

Prices are returned as **integers in minor units** (e.g. `150000` = `KSh 1,500.00`
given a minor unit of 2). Always format with `formatMinor(value, currency_minor_unit)`
or `formatStorePrice(...)`.

### Personalization

Personalized items (customized notes) send a top-level `ws_personalization`
object with the add-item request:

```json
{
  "id": 42,
  "quantity": 1,
  "ws_personalization": {
    "recipient": "Amina",
    "occasion": "birthday",
    "tone": "warm",
    "length": "short",
    "delivery": "digital",
    "notes": "Please mention her love of jazz."
  }
}
```

The plugin validates and stores this on the cart line, then on the order item.

### Checkout

`POST /checkout` with `payment_method: "walkingshadow_mpesa"` places the order
and returns `{ id, order_key, status, payment_result }`. The order is placed
**on hold**; payment is confirmed separately via M-Pesa (below). The client
never marks an order paid.

## Walking Shadow Commerce plugin API

Base: `VITE_COMMERCE_API_URL`. Client: `react-app/src/services/commerce.ts`.

### `POST /mpesa/stk-push`

Body:

```json
{ "order_id": 123, "order_key": "wc_order_…", "phone": "0712345678" }
```

`order_key` must match the order's key (authorisation). Response:

```json
{ "success": true, "message": "…", "checkout_request_id": "ws_CO_…", "customer_message": "…" }
```

### `GET /mpesa/status`

Query: `order_id`, `order_key`. Response:

```json
{ "order_id": 123, "status": "pending|processing|paid|failed|cancelled", "paid": false, "mpesa_receipt": "", "amount": 1500 }
```

The checkout page polls this until the status resolves.

### `POST /mpesa/callback`

Safaricom Daraja callback. Public but validated: the plugin matches the order by
`CheckoutRequestID`, verifies the amount against the order total, and only then
calls `payment_complete()`. Configure the callback URL under **Walking Shadow**
settings.

### `POST /commissions`

Body (camelCase):

```json
{
  "customerName": "…", "email": "…", "phone": "…", "poetryType": "…",
  "recipient": "…", "occasion": "…", "theme": "…", "tone": "…",
  "length": "…", "details": "…", "instructions": "…"
}
```

Response: `{ "success": true, "message": "…", "commission_id": 12, "reference": "WSP-AB12CD" }`.

### `POST /newsletter`

Body: `{ "email": "…", "source": "shop" }`.
Response: `{ "success": true, "message": "…" }`.

## Error handling

* Store API errors throw `StoreApiError` with the HTTP status and message.
* Plugin errors throw `CommerceApiError`.
* The UI surfaces the message and never fabricates a success state.

## Mock mode

When `VITE_USE_MOCK_DATA=true`, `storeApi.ts` and `mockCart.ts` serve a local
dataset and simulate orders. This is for local development only and is always
announced in the UI via `DevDataNotice`.

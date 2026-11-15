# Storefront environment variables

All frontend configuration is read from Vite environment variables at build
time. Copy `react-app/.env.example` to `react-app/.env` and adjust.

> Only **public** values belong here. M-Pesa credentials and other secrets live
> server-side in the `walking-shadow-commerce` plugin and must never be added to
> the frontend bundle.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_WORDPRESS_API_URL` | no | `https://walkingshadowpoetry.com/blog/wp-json/wp/v2` | WordPress content install (journal / episodes). |
| `VITE_STORE_API_URL` | no | `https://walkingshadowpoetry.com/shop/wp-json/wc/store/v1` | WooCommerce Store API — catalog, cart, checkout. |
| `VITE_COMMERCE_API_URL` | no | `https://walkingshadowpoetry.com/shop/wp-json/walkingshadow/v1` | Walking Shadow Commerce plugin — M-Pesa, commissions, newsletter. |
| `VITE_SITE_URL` | no | `https://walkingshadowpoetry.com` | Absolute origin for canonical URLs, Open Graph and JSON-LD. |
| `VITE_MPESA_GATEWAY_ID` | no | `walkingshadow_mpesa` | WooCommerce payment gateway id. Must match `class-wsc-gateway.php`. |
| `VITE_USE_MOCK_DATA` | no | `false` | When `true`, the shop reads a clearly-labelled local dataset instead of WooCommerce. **Never enable in production.** |

## Examples

### Production

```dotenv
VITE_WORDPRESS_API_URL=https://walkingshadowpoetry.com/blog/wp-json/wp/v2
VITE_STORE_API_URL=https://walkingshadowpoetry.com/shop/wp-json/wc/store/v1
VITE_COMMERCE_API_URL=https://walkingshadowpoetry.com/shop/wp-json/walkingshadow/v1
VITE_SITE_URL=https://walkingshadowpoetry.com
VITE_MPESA_GATEWAY_ID=walkingshadow_mpesa
VITE_USE_MOCK_DATA=false
```

### Local development against the live WooCommerce store

```dotenv
VITE_USE_MOCK_DATA=false
```

The live Store API allows the production origin via CORS; for localhost, the
plugin also allows `http://localhost:5173` and `http://localhost:4173`.

### Local development with mock data (no backend required)

```dotenv
VITE_USE_MOCK_DATA=true
```

A `DevDataNotice` banner is rendered on every shop page when mock data is
active so it can never be mistaken for live data.

## Notes

* Environment variables are **baked in at build time**. Changing them requires a
  rebuild (`npm run build`) and redeploy — restarting the server is not enough.
* Only variables prefixed with `VITE_` are exposed to the client.
* `VITE_USE_MOCK_DATA` must be the exact string `true` to activate mock mode.

# Shop deployment guide

How to deploy the Walking Shadow Poetry storefront (React SPA) and the
`walking-shadow-commerce` WordPress plugin so that `https://walkingshadowpoetry.com/shop`
serves the React storefront while WooCommerce keeps serving its REST API.

## Architecture

| Piece | Location | Notes |
| --- | --- | --- |
| React storefront (SPA) | web root `/` | built to `react-app/dist/` |
| WordPress + WooCommerce | `/shop` | Store API at `/shop/wp-json/wc/store/v1` |
| WordPress content blog | `/blog` | separate install, unchanged |
| Custom commerce plugin | `/shop/wp-content/plugins/walking-shadow-commerce` | M-Pesa, commissions, newsletter |

The React app owns `/shop` and `/shop/*`. WordPress keeps `/shop/wp-json/*`,
`/shop/wp-admin/*`, `/shop/wp-login.php`, `/shop/wp-content/*`,
`/shop/wp-includes/*` and `/shop/xmlrpc.php`.

## 1. Build the frontend

```bash
cd react-app
cp .env.example .env      # then edit values — see docs/shop-environment.md
npm ci
npm run build             # outputs to react-app/dist/
```

Verify locally before uploading:

```bash
npm run preview
```

## 2. Upload the build

Upload the **contents** of `react-app/dist/` to the web root (the directory
serving `https://walkingshadowpoetry.com/`). The build already includes
`.htaccess` from `public/.htaccess`.

Confirm the root `.htaccess` contains the shop-coexistence rules (see below).
The key part that keeps WooCommerce reachable is the block that passes
`/shop/wp-json/`, `/shop/wp-admin/`, etc. straight through to WordPress.

```apache
RewriteRule ^shop/wp-json/ - [L]
RewriteRule ^shop/wp-admin/ - [L]
RewriteRule ^shop/wp-login\.php$ - [L]
RewriteRule ^shop/wp-content/ - [L]
RewriteRule ^shop/wp-includes/ - [L]
RewriteRule ^shop/xmlrpc\.php$ - [L]
RewriteRule ^assets/ - [L]
RewriteRule ^shop/?$ /index.html [E=SPA_HTML:1,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^shop/(.*)$ /index.html [E=SPA_HTML:1,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [E=SPA_HTML:1,L]
```

`index.html` must never be cached. `public/.htaccess` sends
`Cache-Control: no-store, no-cache, must-revalidate, max-age=0` for it while
hashed `/assets/*` files remain cacheable. After each deploy, purge LiteSpeed,
any CDN, and browser caches; otherwise visitors can keep an old `index.html`
that points to deleted hashed chunks and see MIME/module errors.

> **LiteSpeed note.** The production server runs LiteSpeed, which reads
> `.htaccess`. After uploading, verify all of the following return the expected
> responses (see step 5).

## 3. Install the WordPress plugin

1. Copy `wordpress-plugin/walking-shadow-commerce/` to
   `/shop/wp-content/plugins/`.
2. In `/shop/wp-admin`, activate **Walking Shadow Commerce**.
3. Open **Walking Shadow** in the admin menu and enter your Daraja credentials.
4. Enable **M-Pesa (Daraja)** under **WooCommerce → Settings → Payments**.

See `docs/walking-shadow-commerce-plugin.md` for full configuration.

## 4. WooCommerce configuration

* Set the store currency to **KES** (Kenyan Shilling).
* Keep the existing product and category data. The storefront reads all product
  names, prices, descriptions, images, categories and stock from the Store API.
* Configure a shipping zone for Kenya with at least one method; checkout reads
  live shipping rates from the Store API.
* Upload version **1.1.0** of the plugin or later so personalization is attached
  to `cart_item_data` correctly. Nothing else is required — the plugin reads the
  `ws_personalization` payload automatically.

## 5. Post-deploy verification

| Check | Expected |
| --- | --- |
| `GET /shop` | React storefront HTML (`id="root"`) |
| `GET /shop/clothing` | React storefront HTML |
| `GET /shop/wp-json/wc/store/v1/products` | JSON product list |
| `GET /shop/wp-json/wc/store/v1/products/categories` | JSON category list |
| `GET /shop/wp-json/wc/store/v1/products/reviews?product_id=74` | JSON review list |
| `GET /shop/wp-json/walkingshadow/v1/mpesa/status?order_id=1&order_key=x` | JSON (403/404 is fine — proves the route is live) |
| `GET /shop/wp-admin/` | WordPress login / admin |
| `GET /blog` | WordPress content blog |

If `/shop/*` returns WordPress instead of the SPA, the root `.htaccess` rules
were not applied (check `AllowOverride` / LiteSpeed config). If `/shop/wp-json`
returns the SPA, the exclusion rules are missing.

## 6. Caching and CDN

* Cache-bust hashed assets aggressively (`/assets/*`), but **never cache**
  `index.html` or any `/shop/wp-json/*` response.
* If a CDN sits in front, add a bypass rule for `/shop/wp-json/*`,
  `/shop/wp-admin/*` and `/shop/wp-login.php`.
* Purge the CDN and LiteSpeed cache after each deploy.

## Rollback

Keep the previous `dist/` contents (or the previous `.htaccess`) so you can
restore them quickly. Reverting the root `.htaccess` alone restores the old
`/shop` → WordPress behaviour.

/**
 * Runtime configuration for the headless commerce integration.
 *
 * All values come from Vite environment variables (see `.env.example`).
 * Only PUBLIC, non-secret values belong here. Private credentials for
 * WooCommerce admin, M-Pesa Daraja and SMTP live server-side in the
 * WordPress plugin — never in this bundle.
 */

const DEFAULT_SITE_URL = 'https://walkingshadowpoetry.com';

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, '');
}

/**
 * Accepts an absolute URL or a root-relative path. Relative paths resolve
 * against the current origin so the Vite dev proxy works without hard-coding
 * the dev server port.
 */
function resolveBaseUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return trimTrailingSlash(value);
  }
  const origin =
    typeof window !== 'undefined' ? window.location.origin : DEFAULT_SITE_URL;
  return trimTrailingSlash(new URL(value, origin).toString());
}

/** WordPress content install (stories / journal). */
export const WORDPRESS_API_URL = resolveBaseUrl(
  import.meta.env.VITE_WORDPRESS_API_URL ||
    `${DEFAULT_SITE_URL}/blog/wp-json/wp/v2`,
);

/** WooCommerce Store API (public, customer-facing commerce). */
export const STORE_API_URL = resolveBaseUrl(
  import.meta.env.VITE_STORE_API_URL ||
    `${DEFAULT_SITE_URL}/shop/wp-json/wc/store/v1`,
);

/**
 * Custom Walking Shadow Commerce plugin endpoints (M-Pesa, commissions,
 * personalization). Implemented by `wordpress-plugin/walking-shadow-commerce`.
 */
export const COMMERCE_API_URL = resolveBaseUrl(
  import.meta.env.VITE_COMMERCE_API_URL ||
    `${DEFAULT_SITE_URL}/shop/wp-json/walkingshadow/v1`,
);

/**
 * When `true`, the shop reads from the clearly-labelled local development
 * dataset instead of WooCommerce. Never enable in production.
 */
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

/** Absolute site origin used for canonical URLs and SEO metadata. */
export const SITE_URL = trimTrailingSlash(
  import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL,
);

export const STORE_LOCALE = {
  currencyCode: 'KES',
  currencySymbol: 'KSh',
} as const;

/**
 * WooCommerce payment gateway id registered by the Walking Shadow Commerce
 * plugin for M-Pesa. Must match the gateway id in the plugin.
 */
export const MPESA_GATEWAY_ID =
  import.meta.env.VITE_MPESA_GATEWAY_ID || 'walkingshadow_mpesa';

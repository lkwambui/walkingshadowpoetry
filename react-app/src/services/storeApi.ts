import { STORE_API_URL } from './config';
import { mockCategories, mockProducts, mockVariations } from './mock/catalog';

/**
 * WooCommerce Store API client.
 *
 * The Store API is the authoritative source for catalogue, cart, stock and
 * checkout pricing. This module only talks to public Store API routes and
 * never handles private credentials.
 *
 * Docs: https://developer.woocommerce.com/docs/apis/store-api/
 */

/* ------------------------------------------------------------------ types */

export interface StorePrice {
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min_amount: string; max_amount: string } | null;
}

export interface StoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  sizes: string;
  thumbnail_srcset?: string;
  thumbnail_sizes?: string;
  name: string;
  alt: string;
}

export interface StoreTerm {
  id: number;
  name: string;
  slug: string;
  link?: string;
}

export interface StoreAttributeTerm {
  id: number;
  name: string;
  slug: string;
  default?: boolean;
}

export interface StoreAttribute {
  id: number;
  name: string;
  taxonomy: string | null;
  has_variations: boolean;
  terms: StoreAttributeTerm[];
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  parent: number;
  type: 'simple' | 'variable' | 'variation' | 'grouped' | 'external';
  variation: string;
  permalink: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: StorePrice;
  price_html: string;
  images: StoreImage[];
  categories: StoreTerm[];
  tags: StoreTerm[];
  average_rating?: string;
  review_count?: number;
  total_sales?: number;
  attributes: StoreAttribute[];
  variations: { id: number; attributes: { name: string; value: string }[] }[];
  has_options: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  is_on_backorder: boolean;
  low_stock_remaining: number | null;
  stock_availability: { text: string; class: string };
  sold_individually: boolean;
  add_to_cart: {
    text: string;
    description: string;
    url: string;
    minimum: number;
    maximum: number;
    multiple_of: number;
    single_text: string;
  };
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  short_description: string;
  sku: string;
  prices: StorePrice;
  totals: {
    line_subtotal: string;
    line_subtotal_tax: string;
    line_total: string;
    line_total_tax: string;
    currency_minor_unit: number;
  };
  images: StoreImage[];
  variation: { attribute: string; value: string }[];
  item_data: { key: string; value: string; display: string; raw_key?: string }[];
  permalink?: string;
  extensions?: Record<string, unknown>;
}

export interface StoreCartTotals {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string | null;
  total_shipping_tax: string | null;
  total_price: string;
  total_tax: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phone: string;
  email?: string;
}

export interface StoreShippingRate {
  package_id: number;
  name: string;
  destination: StoreAddress;
  items: { key: string; name: string; quantity: number }[];
  shipping_rates: {
    rate_id: string;
    name: string;
    description: string;
    delivery_time: string;
    price: string;
    taxes: string;
    instance_id: number;
    method_id: string;
    meta_data: { key: string; value: string }[];
    selected: boolean;
    currency_minor_unit: number;
  }[];
}

export interface StoreCart {
  items: StoreCartItem[];
  coupons: { code: string; totals: Record<string, string> }[];
  fees: unknown[];
  totals: StoreCartTotals;
  shipping_address: StoreAddress;
  billing_address: StoreAddress;
  needs_payment: boolean;
  needs_shipping: boolean;
  payment_requirements: string[];
  shipping_rates?: StoreShippingRate[];
  extensions?: Record<string, unknown>;
}

export interface StoreOrder {
  id: number;
  status: string;
  order_key: string;
  order_number: string;
  currency_code: string;
  date_created: string;
  total: string;
  totals: StoreCartTotals;
  items: StoreCartItem[];
  billing_address: StoreAddress;
  shipping_address: StoreAddress;
  payment_result?: {
    payment_status: 'success' | 'failure' | 'pending';
    payment_details: { key: string; value: string }[];
    redirect_url: string;
  };
  extensions?: Record<string, unknown>;
}

export interface StoreProductReview {
  id: number;
  date_created: string;
  name: string;
  email?: string;
  rating: number;
  review: string;
  verified: boolean;
}

export interface ProductCollection {
  items: StoreProduct[];
  total: number;
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  search?: string;
  category?: string;
  tag?: string;
  minPrice?: string;
  maxPrice?: string;
  onSale?: boolean;
  featured?: boolean;
  orderby?: 'date' | 'price' | 'popularity' | 'rating' | 'title' | 'menu_order';
  order?: 'asc' | 'desc';
  attribute?: string;
  attributeTerm?: string;
  stockStatus?: 'instock' | 'outofstock' | 'onbackorder';
  slug?: string;
}

export interface AddToCartInput {
  id: number;
  quantity?: number;
  variation?: { attribute: string; value: string }[];
  personalization?: PersonalizationData;
}

export interface PersonalizationData {
  productKind: 'customized-note' | 'commissioned-poem';
  recipientName: string;
  occasion: string;
  tone: string;
  length: string;
  deliveryFormat: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  relationship?: string;
  pronunciation?: string;
  otherOccasion?: string;
  message?: string;
  story?: string;
  memories?: string;
  importantDetails?: string;
  poeticStyle?: string;
  instructions?: string;
  surprise?: 'yes' | 'no';
  preferredDate?: string;
  dedication?: 'yes' | 'no';
  dedicationText?: string;
  privatePoem?: 'yes' | 'no';
  theme?: string;
  keyDetails?: string;
}

export interface CheckoutPayload {
  billing_address: Partial<StoreAddress>;
  shipping_address: Partial<StoreAddress>;
  customer_note?: string;
  payment_method?: string;
  create_account?: boolean;
  payment_data?: { key: string; value: string }[];
}

/* ------------------------------------------------------- cart token store */

const CART_TOKEN_KEY = 'wsp.store.cart-token';
const CART_NONCE_KEY = 'wsp.store.cart-nonce';

function readStorage(key: string) {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (value) window.localStorage.setItem(key, value);
    else window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable — cart will fall back to session cookies */
  }
}

export function getCartToken() {
  return readStorage(CART_TOKEN_KEY);
}

function persistTokens(response: Response) {
  const cartToken = response.headers.get('Cart-Token');
  if (cartToken) writeStorage(CART_TOKEN_KEY, cartToken);
  const nonce = response.headers.get('Nonce');
  if (nonce) writeStorage(CART_NONCE_KEY, nonce);
}

export function clearCartSession() {
  writeStorage(CART_TOKEN_KEY, null);
  writeStorage(CART_NONCE_KEY, null);
}

/* ---------------------------------------------------------- http helpers */

export class StoreApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'StoreApiError';
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path: string, params: Record<string, unknown> = {}) {
  const url = new URL(`${STORE_API_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((entry) => url.searchParams.append(key, String(entry)));
    } else {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function storeRequest<T>(
  path: string,
  { params = {}, method = 'GET', body }: { params?: Record<string, unknown>; method?: string; body?: unknown } = {},
): Promise<{ data: T; headers: Headers }> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = getCartToken();
  const nonce = readStorage(CART_NONCE_KEY);
  if (token) headers['Cart-Token'] = token;
  if (nonce) headers['Nonce'] = nonce;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  persistTokens(response);

  const text = await response.text();
  const payload = text ? safeJson(text) : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : null) || `Store API request failed (${response.status})`;
    const code =
      payload && typeof payload === 'object' && 'code' in payload
        ? String((payload as { code: unknown }).code)
        : undefined;
    throw new StoreApiError(message, response.status, code);
  }

  return { data: payload as T, headers: response.headers };
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------- catalogue */

const productParams = (query: ProductQuery): Record<string, unknown> => ({
  page: query.page ?? 1,
  per_page: query.perPage ?? 12,
  search: query.search,
  category: query.category,
  tag: query.tag,
  min_price: query.minPrice,
  max_price: query.maxPrice,
  on_sale: query.onSale ? 'true' : undefined,
  featured: query.featured ? 'true' : undefined,
  orderby: query.orderby ?? 'date',
  order: query.order ?? 'desc',
  stock_status: query.stockStatus,
  slug: query.slug,
  attribute: query.attribute,
  attribute_term: query.attributeTerm,
});

export async function fetchProducts(query: ProductQuery = {}): Promise<StoreProduct[]> {
  const { data } = await storeRequest<StoreProduct[]>('/products', {
    params: productParams(query),
  });
  return data;
}

/** Catalogue query that also returns WooCommerce's X-WP-Total result count. */
export async function fetchProductCollection(query: ProductQuery = {}): Promise<ProductCollection> {
  const { data, headers } = await storeRequest<StoreProduct[]>('/products', {
    params: productParams(query),
  });
  const total = Number(headers.get('X-WP-Total') ?? data.length);
  return { items: data, total: Number.isFinite(total) ? total : data.length };
}

export async function fetchProductReviews(
  productId: number,
  perPage = 10,
): Promise<StoreProductReview[]> {
  const { data } = await storeRequest<StoreProductReview[]>('/products/reviews', {
    params: { product_id: productId, per_page: perPage, orderby: 'date', order: 'desc' },
  });
  return Array.isArray(data) ? data : [];
}

export async function fetchProductBySlug(slug: string): Promise<StoreProduct | null> {
  const { data } = await storeRequest<StoreProduct[] | StoreProduct>('/products', {
    params: { slug, per_page: 1 },
  });
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
}

export async function fetchProductById(id: number): Promise<StoreProduct> {
  const { data } = await storeRequest<StoreProduct>(`/products/${id}`);
  return data;
}

export async function fetchProductVariations(parentId: number): Promise<StoreProduct[]> {
  const { data } = await storeRequest<StoreProduct[]>('/products', {
    params: { type: 'variation', parent: parentId, per_page: 100 },
  });
  return data;
}

export async function fetchCategories(): Promise<StoreTerm[]> {
  const { data } = await storeRequest<StoreTerm[]>('/products/categories', {
    params: { per_page: 100, hide_empty: false },
  });
  return data;
}

export async function fetchProductAttributes(): Promise<StoreAttribute[]> {
  const { data } = await storeRequest<StoreAttribute[]>('/products/attributes', {
    params: { per_page: 100 },
  });
  return data;
}

export async function fetchProductsByCategorySlug(
  slug: string,
  query: ProductQuery = {},
): Promise<StoreProduct[]> {
  return fetchProducts({ ...query, category: slug });
}

/* ------------------------------------------------------------------ cart */

export async function fetchCart(): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart');
  return data;
}

export async function addToCart(input: AddToCartInput): Promise<StoreCart> {
  const body: Record<string, unknown> = {
    id: input.id,
    quantity: input.quantity ?? 1,
  };
  if (input.variation?.length) body.variation = input.variation;
  if (input.personalization) body.ws_personalization = input.personalization;

  const { data } = await storeRequest<StoreCart>('/cart/add-item', {
    method: 'POST',
    body,
  });
  return data;
}

export async function updateCartItem(key: string, quantity: number): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/update-item', {
    method: 'POST',
    body: { key, quantity },
  });
  return data;
}

export async function removeCartItem(key: string): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/remove-item', {
    method: 'POST',
    body: { key },
  });
  return data;
}

export async function updateCartCustomer(address: Partial<StoreAddress>): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/update-customer', {
    method: 'POST',
    body: { billing_address: address, shipping_address: address },
  });
  return data;
}

export async function selectShippingRate(packageId: number, rateId: string): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/select-shipping-rate', {
    method: 'POST',
    body: { package_id: packageId, rate_id: rateId },
  });
  return data;
}

export async function applyCoupon(code: string): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/apply-coupon', {
    method: 'POST',
    body: { code },
  });
  return data;
}

export async function removeCoupon(code: string): Promise<StoreCart> {
  const { data } = await storeRequest<StoreCart>('/cart/remove-coupon', {
    method: 'POST',
    body: { code },
  });
  return data;
}

/* -------------------------------------------------------------- checkout */

export async function submitCheckout(payload: CheckoutPayload): Promise<StoreOrder> {
  const { data } = await storeRequest<StoreOrder>('/checkout', {
    method: 'POST',
    body: payload,
  });
  return data;
}

export async function fetchOrder(id: number, orderKey: string): Promise<StoreOrder> {
  const { data } = await storeRequest<StoreOrder>(`/order/${id}`, {
    params: { key: orderKey },
  });
  return data;
}

/* ------------------------------------------------------------- utilities */

export function formatStorePrice(
  prices: Pick<StorePrice, 'currency_prefix' | 'currency_suffix' | 'currency_minor_unit' | 'currency_decimal_separator' | 'currency_thousand_separator'> & {
    price: string;
  },
): string {
  const minorUnit = prices.currency_minor_unit ?? 2;
  const numeric = Number(prices.price) / 10 ** minorUnit;
  const formatted = numeric.toLocaleString('en-KE', {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  });
  return `${prices.currency_prefix ?? ''}${formatted}${prices.currency_suffix ?? ''}`.trim();
}

export function formatMinor(
  amount: string | number,
  minorUnit = 2,
  prefix = 'KSh ',
): string {
  const numeric = Number(amount) / 10 ** minorUnit;
  return `${prefix}${numeric.toLocaleString('en-KE', {
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  })}`;
}

/**
 * Returns the effective product source. When mock mode is enabled the
 * clearly-separated development catalogue is used; otherwise WooCommerce
 * is authoritative.
 */
export function isMockMode() {
  return import.meta.env.VITE_USE_MOCK_DATA === 'true';
}

export const mockSource = {
  products: mockProducts,
  categories: mockCategories,
  variations: mockVariations,
};

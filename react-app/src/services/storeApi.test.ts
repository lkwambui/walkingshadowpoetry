import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  StoreApiError,
  addToCart,
  clearCartSession,
  fetchProducts,
  formatMinor,
  formatStorePrice,
  getCartToken,
  submitCheckout,
  updateCartCustomer,
} from './storeApi';
import type { PersonalizationData } from './storeApi';

function jsonResponse(
  body: unknown,
  { status = 200, headers = {} }: { status?: number; headers?: Record<string, string> } = {},
) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

const personalization: PersonalizationData = {
  productKind: 'customized-note',
  recipientName: 'Amina',
  occasion: 'birthday',
  theme: 'her love of jazz',
  tone: 'warm',
  keyDetails: 'Mention the city at dusk.',
  length: 'short',
  instructions: 'Deliver by email.',
  deliveryFormat: 'digital',
};

describe('price formatting', () => {
  it('formats a Store API price object', () => {
    const formatted = formatStorePrice({
      price: '150000',
      currency_prefix: 'KSh ',
      currency_suffix: '',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
    });
    expect(formatted).toBe('KSh 1,500.00');
  });

  it('formats a minor-unit amount', () => {
    expect(formatMinor('150000', 2, 'KSh ')).toBe('KSh 1,500.00');
    expect(formatMinor(350000, 2, 'KSh ')).toBe('KSh 3,500.00');
  });
});

describe('catalogue requests', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    clearCartSession();
    mockFetch = vi.fn().mockResolvedValue(jsonResponse([]));
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('builds query parameters and skips empty values', async () => {
    await fetchProducts({ search: 'hoodie', perPage: 24, orderby: 'price', order: 'asc' });

    const calledUrl = new URL(String(mockFetch.mock.calls[0][0]));
    expect(calledUrl.pathname).toContain('/products');
    expect(calledUrl.searchParams.get('search')).toBe('hoodie');
    expect(calledUrl.searchParams.get('per_page')).toBe('24');
    expect(calledUrl.searchParams.get('orderby')).toBe('price');
    expect(calledUrl.searchParams.get('order')).toBe('asc');
    expect(calledUrl.searchParams.has('slug')).toBe(false);
  });
});

describe('cart requests', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    window.localStorage.clear();
    clearCartSession();
    mockFetch = vi.fn().mockResolvedValue(jsonResponse({ items: [] }));
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('sends personalization as a top-level ws_personalization key', async () => {
    await addToCart({ id: 501, quantity: 1, personalization });

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body as string);
    expect(body.id).toBe(501);
    expect(body.quantity).toBe(1);
    expect(body.ws_personalization.recipientName).toBe('Amina');
    expect(body.variation).toBeUndefined();
  });

  it('sends variation selections and omits personalization when absent', async () => {
    await addToCart({
      id: 101,
      quantity: 2,
      variation: [{ attribute: 'Size', value: 'M' }],
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.variation).toEqual([{ attribute: 'Size', value: 'M' }]);
    expect(body.ws_personalization).toBeUndefined();
  });

  it('sends both billing and shipping addresses when updating the customer', async () => {
    await updateCartCustomer({ first_name: 'Amina', city: 'Nakuru', country: 'KE' });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body as string);
    expect(body.billing_address.city).toBe('Nakuru');
    expect(body.shipping_address.city).toBe('Nakuru');
  });

  it('persists the Cart-Token and replays it on later requests', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ items: [] }, { headers: { 'Cart-Token': 'tok-123' } }));

    await fetchProducts();
    expect(getCartToken()).toBe('tok-123');

    mockFetch.mockResolvedValueOnce(jsonResponse({ items: [] }));
    await fetchProducts();
    const headers = mockFetch.mock.calls[1][1].headers as Record<string, string>;
    expect(headers['Cart-Token']).toBe('tok-123');

    clearCartSession();
    expect(getCartToken()).toBeNull();
  });

  it('throws a StoreApiError carrying status and code on failure', async () => {
    mockFetch.mockImplementation(() =>
      jsonResponse({ message: 'Product not found.', code: 'not_found' }, { status: 404 }),
    );

    await expect(fetchProducts()).rejects.toMatchObject({
      name: 'StoreApiError',
      status: 404,
      code: 'not_found',
      message: 'Product not found.',
    });

    await expect(fetchProducts()).rejects.toBeInstanceOf(StoreApiError);
  });
});

describe('checkout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearCartSession();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 9001, order_key: 'wc_1' })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns the created order', async () => {
    const order = await submitCheckout({
      billing_address: { first_name: 'Amina' },
      shipping_address: { first_name: 'Amina' },
      payment_method: 'walkingshadow_mpesa',
    });
    expect(order.id).toBe(9001);
    expect(order.order_key).toBe('wc_1');
  });
});

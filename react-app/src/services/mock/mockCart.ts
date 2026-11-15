/**
 * DEVELOPMENT-ONLY cart backend.
 *
 * Mirrors the shape of the WooCommerce Store API cart so the storefront can
 * run against the mock catalogue. Used only when `VITE_USE_MOCK_DATA=true`.
 * In production the Store API is authoritative and this file is never used.
 */

import type {
  AddToCartInput,
  StoreAddress,
  StoreCart,
  StoreCartItem,
  StoreCartTotals,
} from '../storeApi';
import { mockProducts, mockVariations } from './catalog';

const STORAGE_KEY = 'wsp.mock.cart';

const EMPTY_ADDRESS: StoreAddress = {
  first_name: '',
  last_name: '',
  company: '',
  address_1: '',
  address_2: '',
  city: '',
  state: '',
  postcode: '',
  country: 'KE',
  phone: '',
  email: '',
};

function buildTotals(items: StoreCartItem[], shipping = 0): StoreCartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.totals.line_subtotal),
    0,
  );
  const total = subtotal + shipping;
  return {
    total_items: String(subtotal),
    total_items_tax: '0',
    total_fees: '0',
    total_fees_tax: '0',
    total_discount: '0',
    total_discount_tax: '0',
    total_shipping: String(shipping),
    total_shipping_tax: '0',
    total_price: String(total),
    total_tax: '0',
    currency_code: 'KES',
    currency_symbol: 'KSh',
    currency_minor_unit: 2,
    currency_decimal_separator: '.',
    currency_thousand_separator: ',',
    currency_prefix: 'KSh ',
    currency_suffix: '',
  };
}

function emptyCart(): StoreCart {
  return {
    items: [],
    coupons: [],
    fees: [],
    totals: buildTotals([]),
    shipping_address: { ...EMPTY_ADDRESS },
    billing_address: { ...EMPTY_ADDRESS },
    needs_payment: false,
    needs_shipping: true,
    payment_requirements: ['products'],
  };
}

export function loadMockCart(): StoreCart {
  if (typeof window === 'undefined') return emptyCart();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyCart();
    return JSON.parse(raw) as StoreCart;
  } catch {
    return emptyCart();
  }
}

function saveMockCart(cart: StoreCart) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    /* ignore */
  }
}

function resolveProduct(id: number) {
  return (
    mockProducts.find((product) => product.id === id) ??
    mockVariations(id).find((variation) => variation.id === id) ??
    null
  );
}

export function mockAddToCart(input: AddToCartInput): StoreCart {
  const cart = loadMockCart();
  const product = resolveProduct(input.id);
  if (!product) throw new Error('Mock product not found.');

  const quantity = input.quantity ?? 1;
  const variationLabel = input.variation?.map((entry) => entry.value).join(', ') ?? '';
  const key = `${input.id}-${variationLabel || 'default'}`;
  const existing = cart.items.find((item) => item.key === key);
  const unitPrice = Number(product.prices.price);

  if (existing) {
    existing.quantity += quantity;
    existing.totals.line_subtotal = String(unitPrice * existing.quantity);
    existing.totals.line_total = String(unitPrice * existing.quantity);
  } else {
    const itemData: StoreCartItem['item_data'] = [];
    if (input.personalization) {
      const p = input.personalization;
      itemData.push(
        { key: 'recipient', value: p.recipientName, display: `Recipient: ${p.recipientName}` },
        { key: 'occasion', value: p.occasion, display: `Occasion: ${p.occasion}` },
        { key: 'tone', value: p.tone, display: `Tone: ${p.tone}` },
        { key: 'delivery', value: p.deliveryFormat, display: `Delivery: ${p.deliveryFormat}` },
      );
    }

    const item: StoreCartItem = {
      key,
      id: product.id,
      quantity,
      name: product.name,
      short_description: product.short_description,
      sku: product.sku,
      prices: product.prices,
      totals: {
        line_subtotal: String(unitPrice * quantity),
        line_subtotal_tax: '0',
        line_total: String(unitPrice * quantity),
        line_total_tax: '0',
        currency_minor_unit: 2,
      },
      images: product.images,
      variation: input.variation ?? [],
      item_data: itemData,
    };
    cart.items.push(item);
  }

  cart.totals = buildTotals(cart.items, Number(cart.totals.total_shipping ?? 0));
  cart.needs_payment = cart.items.length > 0;
  saveMockCart(cart);
  return cart;
}

export function mockUpdateItem(key: string, quantity: number): StoreCart {
  const cart = loadMockCart();
  if (quantity <= 0) return mockRemoveItem(key);
  const item = cart.items.find((entry) => entry.key === key);
  if (item) {
    const unitPrice = Number(item.prices.price);
    item.quantity = quantity;
    item.totals.line_subtotal = String(unitPrice * quantity);
    item.totals.line_total = String(unitPrice * quantity);
  }
  cart.totals = buildTotals(cart.items, Number(cart.totals.total_shipping ?? 0));
  saveMockCart(cart);
  return cart;
}

export function mockRemoveItem(key: string): StoreCart {
  const cart = loadMockCart();
  cart.items = cart.items.filter((item) => item.key !== key);
  cart.totals = buildTotals(cart.items, Number(cart.totals.total_shipping ?? 0));
  cart.needs_payment = cart.items.length > 0;
  saveMockCart(cart);
  return cart;
}

export function mockUpdateCustomer(address: Partial<StoreAddress>): StoreCart {
  const cart = loadMockCart();
  cart.billing_address = { ...cart.billing_address, ...address };
  cart.shipping_address = { ...cart.shipping_address, ...address };
  saveMockCart(cart);
  return cart;
}

export function mockClearCart(): StoreCart {
  const cart = emptyCart();
  saveMockCart(cart);
  return cart;
}

/* ------------------------------------------------------ development orders */

export function mockCreateOrder(
  address: Partial<StoreAddress>,
  customerNote?: string,
): import('../storeApi').StoreOrder {
  const cart = loadMockCart();
  const id = Math.floor(100000 + Math.random() * 899999);
  const order = {
    id,
    status: 'pending',
    order_key: `wc_order_mock_${id}`,
    order_number: String(id),
    currency_code: 'KES',
    date_created: new Date().toISOString(),
    total: cart.totals.total_price,
    totals: cart.totals,
    items: cart.items,
    billing_address: { ...cart.billing_address, ...address },
    shipping_address: { ...cart.shipping_address, ...address },
    payment_result: {
      payment_status: 'pending' as const,
      payment_details: customerNote ? [{ key: 'customer_note', value: customerNote }] : [],
      redirect_url: '',
    },
  };
  try {
    window.sessionStorage.setItem(`wsp.mock.order.${id}`, JSON.stringify(order));
  } catch {
    /* ignore */
  }
  return order;
}

export function mockGetOrder(id: number): import('../storeApi').StoreOrder | null {
  try {
    const raw = window.sessionStorage.getItem(`wsp.mock.order.${id}`);
    return raw ? (JSON.parse(raw) as import('../storeApi').StoreOrder) : null;
  } catch {
    return null;
  }
}

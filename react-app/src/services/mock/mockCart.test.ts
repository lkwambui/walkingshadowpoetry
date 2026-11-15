import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadMockCart,
  mockAddToCart,
  mockCreateOrder,
  mockGetOrder,
  mockRemoveItem,
  mockUpdateCustomer,
  mockUpdateItem,
} from './mockCart';
import type { PersonalizationData } from '../storeApi';

const personalization: PersonalizationData = {
  productKind: 'customized-note',
  recipientName: 'Amina',
  occasion: 'birthday',
  theme: 'jazz',
  tone: 'warm',
  keyDetails: 'City at dusk.',
  length: 'short',
  deliveryFormat: 'digital',
};

describe('mock cart backend', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it('adds a variation product and computes totals in minor units', () => {
    const cart = mockAddToCart({
      id: 101,
      quantity: 2,
      variation: [{ attribute: 'Size', value: 'M' }],
    });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(2);
    expect(cart.items[0].totals.line_total).toBe('700000');
    expect(cart.totals.total_price).toBe('700000');
    expect(cart.needs_payment).toBe(true);
  });

  it('increments quantity when the same line is added again', () => {
    mockAddToCart({ id: 101, quantity: 1, variation: [{ attribute: 'Size', value: 'M' }] });
    const cart = mockAddToCart({ id: 101, quantity: 3, variation: [{ attribute: 'Size', value: 'M' }] });

    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(4);
  });

  it('stores personalization as cart item data', () => {
    const cart = mockAddToCart({ id: 501, quantity: 1, personalization });
    const itemData = cart.items[0].item_data;

    expect(itemData.find((entry) => entry.key === 'recipient')?.value).toBe('Amina');
    expect(itemData.find((entry) => entry.key === 'delivery')?.value).toBe('digital');
  });

  it('updates and removes lines', () => {
    const added = mockAddToCart({ id: 101, quantity: 1, variation: [{ attribute: 'Size', value: 'M' }] });
    const key = added.items[0].key;

    const updated = mockUpdateItem(key, 5);
    expect(updated.items[0].quantity).toBe(5);
    expect(updated.totals.total_price).toBe('1750000');

    const removed = mockRemoveItem(key);
    expect(removed.items).toHaveLength(0);
    expect(removed.needs_payment).toBe(false);
  });

  it('removes a line when the quantity drops to zero', () => {
    const added = mockAddToCart({ id: 101, quantity: 1, variation: [{ attribute: 'Size', value: 'M' }] });
    const cart = mockUpdateItem(added.items[0].key, 0);
    expect(cart.items).toHaveLength(0);
  });

  it('merges the customer address into both billing and shipping', () => {
    const cart = mockUpdateCustomer({ city: 'Nakuru', country: 'KE' });
    expect(cart.billing_address.city).toBe('Nakuru');
    expect(cart.shipping_address.city).toBe('Nakuru');
  });

  it('throws for an unknown product', () => {
    expect(() => mockAddToCart({ id: 999999, quantity: 1 })).toThrow('Mock product not found.');
  });

  it('persists the cart to storage', () => {
    mockAddToCart({ id: 101, quantity: 1, variation: [{ attribute: 'Size', value: 'M' }] });
    expect(loadMockCart().items).toHaveLength(1);
  });

  it('round-trips a created order', () => {
    mockAddToCart({ id: 101, quantity: 1, variation: [{ attribute: 'Size', value: 'M' }] });
    const order = mockCreateOrder({ first_name: 'Amina', city: 'Nakuru' }, 'Leave at the gate.');

    expect(order.status).toBe('pending');
    expect(order.payment_result?.payment_details[0].value).toBe('Leave at the gate.');

    const fetched = mockGetOrder(order.id);
    expect(fetched?.order_key).toBe(order.order_key);
  });
});

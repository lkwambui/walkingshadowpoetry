import { describe, expect, it } from 'vitest';
import {
  attributeLabel,
  colourAttribute,
  colourHex,
  productIsPersonalized,
  resolveVariationId,
  sizeAttribute,
  stripHtml,
  variationAttributeMap,
  variationStock,
} from './productUtils';
import type { StoreAttribute, StoreProduct } from './storeApi';

function makeProduct(overrides: Partial<StoreProduct> = {}): StoreProduct {
  return {
    id: 1,
    name: 'Test product',
    slug: 'test-product',
    parent: 0,
    type: 'simple',
    variation: '',
    permalink: '',
    sku: 'WSP-1',
    short_description: '',
    description: '',
    on_sale: false,
    prices: {
      currency_code: 'KES',
      currency_symbol: 'KSh',
      currency_minor_unit: 2,
      currency_decimal_separator: '.',
      currency_thousand_separator: ',',
      currency_prefix: 'KSh ',
      currency_suffix: '',
      price: '100000',
      regular_price: '100000',
      sale_price: '',
      price_range: null,
    },
    price_html: '',
    images: [],
    categories: [],
    tags: [],
    attributes: [],
    variations: [],
    has_options: false,
    is_purchasable: true,
    is_in_stock: true,
    is_on_backorder: false,
    low_stock_remaining: null,
    stock_availability: { text: 'In stock', class: 'in-stock' },
    sold_individually: false,
    add_to_cart: {
      text: 'Add to cart',
      description: '',
      url: '',
      minimum: 1,
      maximum: 10,
      multiple_of: 1,
      single_text: 'Add to cart',
    },
    ...overrides,
  };
}

function attribute(name: string, values: string[]): StoreAttribute {
  return {
    id: 1,
    name,
    taxonomy: `pa_${name.toLowerCase()}`,
    has_variations: true,
    terms: values.map((value, index) => ({ id: index + 1, name: value, slug: value.toLowerCase() })),
  };
}

function variation(attributes: StoreAttribute[], overrides: Partial<StoreProduct> = {}): StoreProduct {
  return makeProduct({ type: 'variation', attributes, ...overrides });
}

describe('attribute helpers', () => {
  it('strips the pa_ prefix and humanises the label', () => {
    expect(attributeLabel('pa_size')).toBe('size');
    expect(attributeLabel('pa_colour')).toBe('colour');
    expect(attributeLabel('product-type')).toBe('product type');
  });

  it('locates size and colour attributes', () => {
    const product = makeProduct({ attributes: [attribute('Size', ['S', 'M']), attribute('Colour', ['Ink'])] });
    expect(sizeAttribute(product)?.name).toBe('Size');
    expect(colourAttribute(product)?.name).toBe('Colour');
    expect(sizeAttribute(makeProduct())).toBeUndefined();
  });
});

describe('colourHex', () => {
  it('maps known colours and falls back to a neutral tone', () => {
    expect(colourHex('Ink')).toBe('#1c1917');
    expect(colourHex('  ivory ')).toBe('#faf7f0');
    expect(colourHex('chartreuse')).toBe('#d6d3d1');
  });
});

describe('variationAttributeMap', () => {
  it('reads values from attribute terms', () => {
    const map = variationAttributeMap(
      variation([attribute('Size', ['M']), attribute('Colour', ['Ink'])]),
    );
    expect(map).toEqual({ size: 'm', colour: 'ink' });
  });

  it('falls back to the variation summary string', () => {
    const map = variationAttributeMap(makeProduct({ type: 'variation', variation: 'Size: M, Colour: Ink' }));
    expect(map).toEqual({ size: 'm', colour: 'ink' });
  });
});

describe('resolveVariationId', () => {
  const parent = makeProduct({ id: 100, type: 'variable' });

  it('returns the product id for simple products', () => {
    expect(resolveVariationId(makeProduct({ id: 7, type: 'simple' }), [], {})).toBe(7);
  });

  it('returns null when nothing is selected', () => {
    expect(resolveVariationId(parent, [], {})).toBeNull();
  });

  it('matches a variation case-insensitively', () => {
    const variations = [
      variation([attribute('Size', ['M']), attribute('Colour', ['Ink'])], { id: 111 }),
      variation([attribute('Size', ['L']), attribute('Colour', ['Ink'])], { id: 112 }),
    ];
    expect(resolveVariationId(parent, variations, { Size: 'm', Colour: 'ink' })).toBe(111);
    expect(resolveVariationId(parent, variations, { size: 'L' })).toBe(112);
  });

  it('returns null when no variation matches', () => {
    const variations = [variation([attribute('Size', ['M'])], { id: 111 })];
    expect(resolveVariationId(parent, variations, { Size: 'XXL' })).toBeNull();
  });

  it('excludes out-of-stock variations', () => {
    const variations = [
      variation([attribute('Size', ['M'])], { id: 111, is_in_stock: false }),
    ];
    expect(resolveVariationId(parent, variations, { Size: 'M' })).toBeNull();
  });
});

describe('variationStock', () => {
  it('reports in stock when no variation is selected', () => {
    expect(variationStock([], null)).toEqual({ inStock: true, lowStock: null });
  });

  it('reports the selected variation stock level', () => {
    const variations = [makeProduct({ id: 5, is_in_stock: true, low_stock_remaining: 3 })];
    expect(variationStock(variations, 5)).toEqual({ inStock: true, lowStock: 3 });
  });
});

describe('stripHtml', () => {
  it('removes tags and decodes common entities', () => {
    expect(stripHtml('<p>Hello&nbsp;<b>world</b> &amp; more</p>')).toBe('Hello world & more');
  });
});

describe('productIsPersonalized', () => {
  it('detects personalized categories', () => {
    const personalized = makeProduct({
      categories: [{ id: 14, name: 'Personalized Notes', slug: 'personalized-notes' }],
    });
    expect(productIsPersonalized(personalized)).toBe(true);
    expect(productIsPersonalized(makeProduct())).toBe(false);
  });
});

/**
 * DEVELOPMENT-ONLY mock catalogue.
 *
 * This data exists so the storefront can be developed and reviewed locally
 * while the WooCommerce catalogue is being populated. It is used ONLY when
 * `VITE_USE_MOCK_DATA=true` and is never silently substituted for the live
 * WooCommerce Store API. The UI shows a clear "development data" notice
 * whenever this dataset is active.
 */

import type {
  StoreAttribute,
  StoreProduct,
  StoreTerm,
} from '../storeApi';

const MINOR = 2;

function prices(amount: number, regular?: number, sale?: number) {
  const p = (value: number) => String(Math.round(value * 10 ** MINOR));
  return {
    currency_code: 'KES',
    currency_symbol: 'KSh',
    currency_minor_unit: MINOR,
    currency_decimal_separator: '.',
    currency_thousand_separator: ',',
    currency_prefix: 'KSh ',
    currency_suffix: '',
    price: p(amount),
    regular_price: p(regular ?? amount),
    sale_price: sale ? p(sale) : '',
    price_range: null,
  };
}

function images(seed: string, alts: string[]) {
  return alts.map((alt, index) => ({
    id: index + 1,
    src: seed,
    thumbnail: seed,
    srcset: '',
    sizes: '',
    name: alt,
    alt,
  }));
}

const SIZE_TERMS = [
  { id: 1, name: 'XS', slug: 'xs' },
  { id: 2, name: 'S', slug: 's' },
  { id: 3, name: 'M', slug: 'm' },
  { id: 4, name: 'L', slug: 'l' },
  { id: 5, name: 'XL', slug: 'xl' },
  { id: 6, name: 'XXL', slug: 'xxl' },
];

const COLOUR_TERMS = [
  { id: 11, name: 'Ivory', slug: 'ivory' },
  { id: 12, name: 'Ink', slug: 'ink' },
  { id: 13, name: 'Terracotta', slug: 'terracotta' },
];

const attributes = (sizeTerms: typeof SIZE_TERMS, colourTerms: typeof COLOUR_TERMS): StoreAttribute[] => [
  {
    id: 1,
    name: 'Size',
    taxonomy: 'pa_size',
    has_variations: true,
    terms: sizeTerms,
  },
  {
    id: 2,
    name: 'Colour',
    taxonomy: 'pa_colour',
    has_variations: true,
    terms: colourTerms,
  },
];

interface MockInput {
  id: number;
  name: string;
  slug: string;
  type?: StoreProduct['type'];
  price: number;
  regular?: number;
  sale?: number;
  description: string;
  category: StoreTerm;
  image: string;
  sizes?: string[];
  colours?: string[];
  onSale?: boolean;
  featured?: boolean;
}

const CATEGORIES: Record<string, StoreTerm> = {
  't-shirts': { id: 10, name: 'T-shirts', slug: 't-shirts', link: '/shop/categories/t-shirts' },
  hoodies: { id: 11, name: 'Hoodies', slug: 'hoodies', link: '/shop/categories/hoodies' },
  sweatshirts: { id: 12, name: 'Sweatshirts', slug: 'sweatshirts', link: '/shop/categories/sweatshirts' },
  caps: { id: 13, name: 'Caps', slug: 'caps', link: '/shop/categories/caps' },
  'personalized-notes': {
    id: 14,
    name: 'Personalized Notes',
    slug: 'personalized-notes',
    link: '/shop/categories/personalized-notes',
  },
  'poetry-commissions': {
    id: 15,
    name: 'Poetry Commissions',
    slug: 'poetry-commissions',
    link: '/shop/categories/poetry-commissions',
  },
};

function buildProduct(input: MockInput): StoreProduct {
  const sizeTerms = input.sizes
    ? SIZE_TERMS.filter((term) => input.sizes?.includes(term.name))
    : [];
  const colourTerms = input.colours
    ? COLOUR_TERMS.filter((term) => input.colours?.includes(term.name))
    : [];
  const productAttributes = attributes(sizeTerms, colourTerms);
  const hasVariations = sizeTerms.length > 0 || colourTerms.length > 0;

  const variations: StoreProduct['variations'] = [];
  if (hasVariations) {
    const sizeList = sizeTerms.length ? sizeTerms : [{ id: 0, name: '', slug: '' }];
    const colourList = colourTerms.length ? colourTerms : [{ id: 0, name: '', slug: '' }];
    let vid = input.id * 1000;
    sizeList.forEach((size) => {
      colourList.forEach((colour) => {
        const attrs: { name: string; value: string }[] = [];
        if (size.name) attrs.push({ name: 'Size', value: size.name });
        if (colour.name) attrs.push({ name: 'Colour', value: colour.name });
        variations.push({ id: ++vid, attributes: attrs });
      });
    });
  }

  return {
    id: input.id,
    name: input.name,
    slug: input.slug,
    parent: 0,
    type: input.type ?? (hasVariations ? 'variable' : 'simple'),
    variation: '',
    permalink: `/shop/products/${input.slug}`,
    sku: `WSP-${input.id}`,
    short_description: input.description,
    description: input.description,
    on_sale: Boolean(input.onSale),
    prices: prices(input.price, input.regular, input.sale),
    price_html: '',
    images: images(input.image, [input.name, `${input.name} detail`]),
    categories: [input.category],
    tags: [],
    attributes: productAttributes,
    variations,
    has_options: hasVariations,
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
  };
}

export const mockProducts: StoreProduct[] = [
  buildProduct({
    id: 101,
    name: 'Grow From What’s Meant To Kill You — Tee',
    slug: 'grow-tee',
    price: 3500,
    regular: 4200,
    sale: 3500,
    onSale: true,
    featured: true,
    description: 'Heavyweight cotton tee printed with the Walking Shadow motto in editorial serif.',
    category: CATEGORIES['t-shirts'],
    image: '/media/shop/shop-poster.webp',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Ivory', 'Ink'],
  }),
  buildProduct({
    id: 102,
    name: 'Walking Shadow Wordmark Tee',
    slug: 'wordmark-tee',
    price: 3200,
    description: 'Everyday tee with the Walking Shadow Poetry wordmark across the chest.',
    category: CATEGORIES['t-shirts'],
    image: '/media/gallery/artist-02.webp',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colours: ['Ivory', 'Terracotta'],
  }),
  buildProduct({
    id: 201,
    name: 'Art From The Heart Hoodie',
    slug: 'art-from-the-heart-hoodie',
    price: 6800,
    featured: true,
    description: 'Brushed-back fleece hoodie, embroidered with “Art from the Heart”.',
    category: CATEGORIES.hoodies,
    image: '/media/gallery/artist-05.webp',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Ink', 'Ivory'],
  }),
  buildProduct({
    id: 202,
    name: 'Shadow Oversized Hoodie',
    slug: 'shadow-oversized-hoodie',
    price: 7200,
    regular: 8200,
    sale: 7200,
    onSale: true,
    description: 'Oversized silhouette with a quietly embroidered shadow motif.',
    category: CATEGORIES.hoodies,
    image: '/media/gallery/artist-07.webp',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colours: ['Ink'],
  }),
  buildProduct({
    id: 301,
    name: 'Resilience Crewneck Sweatshirt',
    slug: 'resilience-crewneck',
    price: 5400,
    description: 'Midweight crewneck printed with a line from the Walking Shadow archive.',
    category: CATEGORIES.sweatshirts,
    image: '/media/gallery/artist-09.webp',
    sizes: ['S', 'M', 'L', 'XL'],
    colours: ['Ivory', 'Ink', 'Terracotta'],
  }),
  buildProduct({
    id: 401,
    name: 'Walking Shadow Cap',
    slug: 'walking-shadow-cap',
    price: 2200,
    description: 'Six-panel cotton cap with a woven Walking Shadow label.',
    category: CATEGORIES.caps,
    image: '/media/gallery/artist-12.webp',
    colours: ['Ink', 'Terracotta'],
  }),
  buildProduct({
    id: 501,
    name: 'Customized Handwritten-Style Note',
    slug: 'customized-note',
    price: 1500,
    featured: true,
    description:
      'A personal note written for someone you love, shaped around their occasion and story.',
    category: CATEGORIES['personalized-notes'],
    image: '/media/poetry/dear-mom.webp',
  }),
  buildProduct({
    id: 502,
    name: 'Personalized Poem — Made For You',
    slug: 'personalized-poem',
    price: 3500,
    description: 'A bespoke poem composed for a person, a moment or a milestone.',
    category: CATEGORIES['personalized-notes'],
    image: '/media/poetry/my-love-poem.webp',
  }),
];

export const mockCategories: StoreTerm[] = Object.values(CATEGORIES);

export function mockVariations(parentId: number): StoreProduct[] {
  const parent = mockProducts.find((product) => product.id === parentId);
  if (!parent) return [];
  return parent.variations.map((variation) => ({
    ...parent,
    id: variation.id,
    parent: parent.id,
    type: 'variation' as const,
    name: `${parent.name} — ${variation.attributes.map((a) => a.value).join(', ')}`,
    slug: `${parent.slug}-${variation.id}`,
    variation: variation.attributes.map((a) => a.value).join(', '),
    attributes: variation.attributes.map((attribute) => ({
      id: 0,
      name: attribute.name,
      taxonomy: null,
      has_variations: false,
      terms: [{ id: 0, name: attribute.value, slug: attribute.value.toLowerCase() }],
    })),
    is_in_stock: true,
  }));
}

/** Attribute filter options surfaced in the development catalogue. */
export const mockAttributeFilters = {
  size: SIZE_TERMS,
  colour: COLOUR_TERMS,
};

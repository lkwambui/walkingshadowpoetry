import type { StoreProduct } from './storeApi';

/** Human-readable label for an attribute taxonomy/name. */
export function attributeLabel(name: string) {
  return name.replace(/^pa_/, '').replace(/[-_]/g, ' ');
}

export function findAttribute(product: StoreProduct, keywords: string[]) {
  return product.attributes.find((attribute) => {
    const haystack = `${attribute.name} ${attribute.taxonomy ?? ''}`.toLowerCase();
    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

export function colourAttribute(product: StoreProduct) {
  return findAttribute(product, ['colour', 'color']);
}

export function sizeAttribute(product: StoreProduct) {
  return findAttribute(product, ['size']);
}

const COLOUR_MAP: Record<string, string> = {
  ivory: '#faf7f0',
  ink: '#1c1917',
  black: '#1c1917',
  terracotta: '#a36200',
  sand: '#f4a832',
  white: '#ffffff',
  brown: '#292524',
  green: '#00aa24',
  blue: '#001fff',
};

export function colourHex(name: string) {
  const key = name.trim().toLowerCase();
  return COLOUR_MAP[key] ?? '#d6d3d1';
}

/**
 * Builds an attribute-name → value map for a variation product. The Store API
 * exposes a variation's assigned values through its `attributes[].terms` and,
 * for some responses, the `variation` summary string.
 */
export function variationAttributeMap(variation: StoreProduct): Record<string, string> {
  const map: Record<string, string> = {};

  variation.attributes.forEach((attribute) => {
    const term = attribute.terms?.[0];
    const value = term?.slug || term?.name || '';
    if (value) map[attribute.name.trim().toLowerCase()] = value.trim().toLowerCase();
  });

  if (Object.keys(map).length === 0 && variation.variation) {
    variation.variation.split(',').forEach((pair) => {
      const [key, value] = pair.split(':').map((part) => part.trim());
      if (key && value) map[key.toLowerCase()] = value.toLowerCase();
    });
  }

  return map;
}

/**
 * Resolves the purchasable variation ID for a variable product given the
 * selected attribute values. Returns null when no matching, in-stock variation
 * exists.
 */
export function resolveVariationId(
  product: StoreProduct,
  variations: StoreProduct[],
  selection: Record<string, string>,
): number | null {
  if (product.type === 'simple') return product.id;

  const chosen = Object.entries(selection).filter(([, value]) => Boolean(value));
  if (chosen.length === 0) return null;

  const match = variations.find((variation) => {
    const map = variationAttributeMap(variation);
    const matchesSelection = chosen.every(([name, slug]) => {
      const value = map[name.trim().toLowerCase()];
      return Boolean(value) && value === slug.trim().toLowerCase();
    });
    return matchesSelection && variation.is_in_stock !== false;
  });

  return match?.id ?? null;
}

export function variationStock(
  variations: StoreProduct[],
  variationId: number | null,
): { inStock: boolean; lowStock: number | null } {
  if (!variationId) return { inStock: true, lowStock: null };
  const variation = variations.find((entry) => entry.id === variationId);
  if (!variation) return { inStock: true, lowStock: null };
  return {
    inStock: variation.is_in_stock !== false,
    lowStock: variation.low_stock_remaining ?? null,
  };
}

export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

export function productIsPersonalized(product: StoreProduct) {
  return product.categories.some((category) =>
    ['personalized-notes', 'poetry-commissions', 'personalized'].includes(category.slug),
  );
}

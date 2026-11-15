import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import {
  fetchCategories,
  fetchProductAttributes,
  fetchProductBySlug,
  fetchProducts,
  fetchProductVariations,
  isMockMode,
} from '../services/storeApi';
import type { ProductQuery, StoreProduct, StoreTerm } from '../services/storeApi';
import { mockCategories, mockProducts, mockVariations } from '../services/mock/catalog';

const MOCK = isMockMode();

function filterMockProducts(query: ProductQuery): StoreProduct[] {
  let items = [...mockProducts];
  if (query.category) {
    items = items.filter((product) =>
      product.categories.some((category) => category.slug === query.category),
    );
  }
  if (query.featured) items = items.filter((product) => product.id === 101 || product.id === 201 || product.id === 501);
  if (query.onSale) items = items.filter((product) => product.on_sale);
  if (query.search) {
    const term = query.search.toLowerCase();
    items = items.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.short_description.toLowerCase().includes(term),
    );
  }
  if (query.minPrice) items = items.filter((p) => Number(p.prices.price) >= Number(query.minPrice) * 100);
  if (query.maxPrice) items = items.filter((p) => Number(p.prices.price) <= Number(query.maxPrice) * 100);
  if (query.orderby === 'price') {
    items.sort((a, b) =>
      query.order === 'asc'
        ? Number(a.prices.price) - Number(b.prices.price)
        : Number(b.prices.price) - Number(a.prices.price),
    );
  } else if (query.orderby === 'title') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }
  return items;
}

export function useProducts(query: ProductQuery = {}) {
  return useQuery({
    queryKey: queryKeys.products(query as Record<string, unknown>),
    queryFn: () => (MOCK ? filterMockProducts(query) : fetchProducts(query)),
    placeholderData: (previous: StoreProduct[] | undefined) => previous,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: async () =>
      MOCK
        ? mockProducts.find((product) => product.slug === slug) ?? null
        : fetchProductBySlug(slug),
    enabled: Boolean(slug),
  });
}

export function useProductVariations(parentId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.variations(parentId ?? 0),
    queryFn: () => (MOCK ? mockVariations(parentId!) : fetchProductVariations(parentId!)),
    enabled: Boolean(parentId),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: (): Promise<StoreTerm[]> => (MOCK ? Promise.resolve(mockCategories) : fetchCategories()),
  });
}

export function useProductAttributes() {
  return useQuery({
    queryKey: queryKeys.attributes(),
    queryFn: () => fetchProductAttributes(),
    enabled: !MOCK,
  });
}

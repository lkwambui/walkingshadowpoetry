import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import {
  fetchCategories,
  fetchProductAttributes,
  fetchProductBySlug,
  fetchProductCollection,
  fetchProductReviews,
  fetchProducts,
  fetchProductVariations,
  isMockMode,
} from '../services/storeApi';
import type { ProductCollection, ProductQuery, StoreProduct, StoreTerm } from '../services/storeApi';
import { mockCategories, mockProducts, mockVariations } from '../services/mock/catalog';

const MOCK = isMockMode();

export function filterMockProducts(query: ProductQuery): StoreProduct[] {
  let items = [...mockProducts];
  if (query.category) {
    const slugs = query.category.split(',').map((slug) => slug.trim()).filter(Boolean);
    items = items.filter((product) =>
      product.categories.some((category) => slugs.includes(category.slug)),
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
  } else if (query.orderby === 'date' || query.orderby === 'popularity') {
    items.sort((a, b) => (query.order === 'asc' ? a.id - b.id : b.id - a.id));
  }
  return items;
}

export function useProductCollection(query: ProductQuery = {}) {
  return useQuery<ProductCollection>({
    queryKey: queryKeys.productCollection(query as Record<string, unknown>),
    queryFn: () =>
      MOCK
        ? Promise.resolve({ items: filterMockProducts(query), total: filterMockProducts(query).length })
        : fetchProductCollection(query),
    placeholderData: (previous) => previous,
  });
}

export function useProductReviews(productId: number | undefined) {
  return useQuery({
    queryKey: queryKeys.productReviews(productId ?? 0),
    queryFn: () => fetchProductReviews(productId!),
    enabled: Boolean(productId) && !MOCK,
  });
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

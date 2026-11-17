import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  products: (params: Record<string, unknown> = {}) => ['products', params] as const,
  productCollection: (params: Record<string, unknown> = {}) => ['product-collection', params] as const,
  product: (slug: string) => ['product', slug] as const,
  productReviews: (id: number) => ['product-reviews', id] as const,
  variations: (id: number) => ['product-variations', id] as const,
  categories: () => ['categories'] as const,
  attributes: () => ['attributes'] as const,
  cart: () => ['cart'] as const,
  order: (id: number) => ['order', id] as const,
  mpesaStatus: (id: number) => ['mpesa-status', id] as const,
};

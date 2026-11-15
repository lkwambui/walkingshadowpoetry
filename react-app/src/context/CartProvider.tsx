import { useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../lib/queryClient';
import {
  addToCart,
  applyCoupon as apiApplyCoupon,
  clearCartSession,
  fetchCart,
  isMockMode,
  removeCartItem,
  removeCoupon as apiRemoveCoupon,
  selectShippingRate,
  updateCartCustomer,
  updateCartItem,
} from '../services/storeApi';
import type {
  AddToCartInput,
  StoreAddress,
  StoreCart,
} from '../services/storeApi';
import {
  loadMockCart,
  mockAddToCart,
  mockClearCart,
  mockRemoveItem,
  mockUpdateCustomer,
  mockUpdateItem,
} from '../services/mock/mockCart';
import { CartContext } from './cart-context';
import type { CartContextValue } from './cart-context';

export default function CartProvider({ children }: { children: ReactNode }) {
  const isMock = isMockMode();
  const queryClient = useQueryClient();
  const [mockCart, setMockCart] = useState<StoreCart | null>(isMock ? loadMockCart() : null);

  const cartQuery = useQuery({
    queryKey: queryKeys.cart(),
    queryFn: fetchCart,
    enabled: !isMock,
    staleTime: 30_000,
    retry: 0,
  });

  const setCart = useCallback(
    (cart: StoreCart) => {
      if (isMock) setMockCart(cart);
      else queryClient.setQueryData(queryKeys.cart(), cart);
    },
    [isMock, queryClient],
  );

  const mutation = useMutation({
    mutationFn: async (action: () => Promise<StoreCart> | StoreCart) => action(),
    onSuccess: (cart) => setCart(cart),
  });

  const addItem = useCallback(
    (input: AddToCartInput) =>
      mutation.mutateAsync(() => (isMock ? mockAddToCart(input) : addToCart(input))).then(() => undefined),
    [isMock, mutation],
  );

  const updateItem = useCallback(
    (key: string, quantity: number) =>
      mutation
        .mutateAsync(() => (isMock ? mockUpdateItem(key, quantity) : updateCartItem(key, quantity)))
        .then(() => undefined),
    [isMock, mutation],
  );

  const removeItem = useCallback(
    (key: string) =>
      mutation
        .mutateAsync(() => (isMock ? mockRemoveItem(key) : removeCartItem(key)))
        .then(() => undefined),
    [isMock, mutation],
  );

  const updateCustomer = useCallback(
    (address: Partial<StoreAddress>) =>
      mutation
        .mutateAsync(() => (isMock ? mockUpdateCustomer(address) : updateCartCustomer(address)))
        .catch(() => null),
    [isMock, mutation],
  );

  const selectShipping = useCallback(
    (packageId: number, rateId: string) =>
      mutation
        .mutateAsync(() =>
          isMock
            ? mockCart ?? loadMockCart()
            : selectShippingRate(packageId, rateId),
        )
        .then(() => undefined),
    [isMock, mockCart, mutation],
  );

  const applyCoupon = useCallback(
    (code: string) =>
      mutation
        .mutateAsync(() => (isMock ? mockCart ?? loadMockCart() : apiApplyCoupon(code)))
        .then(() => undefined),
    [isMock, mockCart, mutation],
  );

  const removeCoupon = useCallback(
    (code: string) =>
      mutation
        .mutateAsync(() => (isMock ? mockCart ?? loadMockCart() : apiRemoveCoupon(code)))
        .then(() => undefined),
    [isMock, mockCart, mutation],
  );

  const refresh = useCallback(() => {
    if (isMock) setMockCart(loadMockCart());
    else queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
  }, [isMock, queryClient]);

  const reset = useCallback(() => {
    if (isMock) setMockCart(mockClearCart());
    else {
      clearCartSession();
      queryClient.invalidateQueries({ queryKey: queryKeys.cart() });
    }
  }, [isMock, queryClient]);

  const cart = isMock ? mockCart : cartQuery.data ?? null;
  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items,
      itemCount,
      isLoading: isMock ? false : cartQuery.isLoading,
      isMutating: mutation.isPending,
      error: isMock ? null : (cartQuery.error as Error | null),
      isMock,
      addItem,
      updateItem,
      removeItem,
      updateCustomer,
      selectShipping,
      applyCoupon,
      removeCoupon,
      refresh,
      reset,
    }),
    [
      cart,
      items,
      itemCount,
      isMock,
      cartQuery.isLoading,
      cartQuery.error,
      mutation.isPending,
      addItem,
      updateItem,
      removeItem,
      updateCustomer,
      selectShipping,
      applyCoupon,
      removeCoupon,
      refresh,
      reset,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

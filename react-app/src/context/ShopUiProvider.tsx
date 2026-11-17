import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import type { StoreProduct } from '../services/storeApi';
import CartDrawer from '../components/shop/CartDrawer';
import QuickViewModal from '../components/shop/QuickViewModal';

interface ShopUiContextValue {
  quickViewProduct: StoreProduct | null;
  openQuickView: (product: StoreProduct) => void;
  closeQuickView: () => void;
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const ShopUiContext = createContext<ShopUiContextValue | null>(null);

export function ShopUiProvider({ children }: { children: ReactNode }) {
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  const closeQuickView = useCallback(() => setQuickViewProduct(null), []);
  const closeCart = useCallback(() => setCartOpen(false), []);
  const openQuickView = useCallback((product: StoreProduct) => {
    setCartOpen(false);
    setQuickViewProduct(product);
  }, []);
  const openCart = useCallback(() => {
    setQuickViewProduct(null);
    setCartOpen(true);
  }, []);

  useEffect(() => {
    setCartOpen(false);
    setQuickViewProduct(null);
  }, [location.pathname]);

  const value = useMemo<ShopUiContextValue>(
    () => ({
      quickViewProduct,
      openQuickView,
      closeQuickView,
      cartOpen,
      openCart,
      closeCart,
    }),
    [quickViewProduct, openQuickView, closeQuickView, cartOpen, openCart, closeCart],
  );

  return (
    <ShopUiContext.Provider value={value}>
      {children}
      <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />
      <CartDrawer open={cartOpen} onClose={closeCart} />
    </ShopUiContext.Provider>
  );
}

export function useShopUi(): ShopUiContextValue {
  const context = useContext(ShopUiContext);
  if (!context) throw new Error('useShopUi must be used within a ShopUiProvider.');
  return context;
}

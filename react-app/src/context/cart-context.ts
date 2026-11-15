import { createContext } from 'react';
import type {
  AddToCartInput,
  StoreAddress,
  StoreCart,
  StoreCartItem,
} from '../services/storeApi';

export interface CartContextValue {
  cart: StoreCart | null;
  items: StoreCartItem[];
  itemCount: number;
  isLoading: boolean;
  isMutating: boolean;
  error: Error | null;
  isMock: boolean;
  addItem: (input: AddToCartInput) => Promise<void>;
  updateItem: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  updateCustomer: (address: Partial<StoreAddress>) => Promise<StoreCart | null>;
  selectShipping: (packageId: number, rateId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: (code: string) => Promise<void>;
  refresh: () => void;
  reset: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

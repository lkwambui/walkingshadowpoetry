import { ShoppingBag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useCart } from '../../hooks/useCart';
import { useDialog } from '../../hooks/useDialog';
import CartLineItem from './CartLineItem';
import CartSummary from './CartSummary';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const dialogRef = useDialog(open, onClose);
  const { cart, items, itemCount, isLoading, isMutating, updateItem, removeItem } = useCart();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
        className="relative flex h-full w-full max-w-md flex-col bg-ivory text-ink shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-5">
          <div>
            <p className="eyebrow text-terracotta">Your selection</p>
            <h2 id="cart-drawer-title" className="mt-1 font-display text-2xl">
              Cart {itemCount > 0 && <span className="text-ink/40">({itemCount})</span>}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="flex size-10 items-center justify-center border border-ink/20 transition-colors hover:bg-ink hover:text-ivory"
          >
            <X className="size-4" strokeWidth={1.6} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {isLoading ? (
            <div className="space-y-6 py-8">
              {[0, 1].map((index) => (
                <div key={index} className="flex gap-4">
                  <div className="aspect-[4/5] w-16 animate-pulse bg-ink/5" />
                  <div className="flex-1 space-y-3 py-2">
                    <div className="h-4 w-2/3 animate-pulse bg-ink/10" />
                    <div className="h-3 w-1/3 animate-pulse bg-ink/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="size-8 text-ink/25" strokeWidth={1.3} />
              <h3 className="mt-6 font-display text-2xl">Your cart is empty</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink/55">
                Discover the collection, or begin a piece written just for someone you love.
              </p>
              <Link
                to="/shop/personalized"
                onClick={onClose}
                className="mt-8 text-[0.6rem] uppercase tracking-[0.2em] text-terracotta underline decoration-terracotta/40 underline-offset-4"
              >
                Explore personalized pieces
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartLineItem
                  key={item.key}
                  item={item}
                  compact
                  busy={isMutating}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {cart && items.length > 0 && (
          <div className="border-t border-ink/15 p-6">
            <CartSummary cart={cart} className="border-0 bg-transparent p-0">
              <Button to="/shop/checkout" variant="dark" size="lg" className="w-full" onClick={onClose}>
                Proceed to checkout
              </Button>
              <Link
                to="/shop/cart"
                onClick={onClose}
                className="mt-4 block text-center text-[0.58rem] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-terracotta"
              >
                View full cart
              </Link>
            </CartSummary>
          </div>
        )}
      </div>
    </div>
  );
}

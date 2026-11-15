import type { ReactNode } from 'react';
import { cn } from '../../utils/format';
import type { StoreCart } from '../../services/storeApi';
import { formatMinor } from '../../services/storeApi';

interface CartSummaryProps {
  cart: StoreCart;
  children?: ReactNode;
  className?: string;
  showShipping?: boolean;
}

export default function CartSummary({ cart, children, className, showShipping = true }: CartSummaryProps) {
  const { totals } = cart;
  const minor = totals.currency_minor_unit;
  const prefix = totals.currency_prefix;
  const shipping = totals.total_shipping;

  return (
    <div className={cn('border border-ink/15 bg-brand-tint/20 p-6 sm:p-7', className)}>
      <h2 className="font-display text-2xl">Order summary</h2>

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-ink/60">Subtotal</dt>
          <dd className="tabular-nums text-ink">
            {formatMinor(totals.total_items, minor, prefix)}
          </dd>
        </div>

        {Number(totals.total_discount) > 0 && (
          <div className="flex items-center justify-between gap-4 text-terracotta">
            <dt>Discount</dt>
            <dd className="tabular-nums">
              −{formatMinor(totals.total_discount, minor, prefix)}
            </dd>
          </div>
        )}

        {showShipping && (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-ink/60">Delivery</dt>
            <dd className="tabular-nums text-ink">
              {shipping === null || Number(shipping) === 0
                ? 'Calculated at checkout'
                : formatMinor(shipping, minor, prefix)}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-ink/15 pt-3 text-base">
          <dt className="font-display text-xl">Total</dt>
          <dd className="font-display text-xl tabular-nums">
            {formatMinor(totals.total_price, minor, prefix)}
          </dd>
        </div>
      </dl>

      {children && <div className="mt-7">{children}</div>}

      <p className="mt-5 text-[0.58rem] uppercase tracking-[0.16em] text-ink/35">
        Prices in Kenyan Shillings · Taxes included where applicable
      </p>
    </div>
  );
}

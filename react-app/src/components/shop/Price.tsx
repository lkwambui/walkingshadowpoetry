import { cn } from '../../utils/format';
import { formatStorePrice } from '../../services/storeApi';
import type { StoreProduct } from '../../services/storeApi';

interface PriceProps {
  product: StoreProduct;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
};

export default function Price({ product, className, size = 'md' }: PriceProps) {
  const { prices } = product;
  const range = prices.price_range;
  const isRange = range && range.min_amount !== range.max_amount;

  if (isRange && range) {
    const min = formatStorePrice({ ...prices, price: range.min_amount });
    const max = formatStorePrice({ ...prices, price: range.max_amount });
    return (
      <p className={cn('font-sans tabular-nums text-ink', sizes[size], className)}>
        {min} – {max}
      </p>
    );
  }

  if (product.on_sale && prices.regular_price && prices.sale_price) {
    return (
      <p className={cn('flex items-center gap-2 font-sans tabular-nums', sizes[size], className)}>
        <span className="text-terracotta">
          {formatStorePrice({ ...prices, price: prices.sale_price })}
        </span>
        <span className="text-ink/40 line-through">
          {formatStorePrice({ ...prices, price: prices.regular_price })}
        </span>
      </p>
    );
  }

  return (
    <p className={cn('font-sans tabular-nums text-ink', sizes[size], className)}>
      {formatStorePrice(prices)}
    </p>
  );
}

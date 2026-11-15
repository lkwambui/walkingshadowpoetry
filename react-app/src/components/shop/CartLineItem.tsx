import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { StoreCartItem } from '../../services/storeApi';
import { formatMinor } from '../../services/storeApi';
import ImageWithFallback from '../common/ImageWithFallback';
import QuantitySelector from './QuantitySelector';

interface CartLineItemProps {
  item: StoreCartItem;
  onUpdate: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  busy?: boolean;
}

export default function CartLineItem({ item, onUpdate, onRemove, busy }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const image = item.images[0];
  const lineTotal = formatMinor(item.totals.line_total, item.totals.currency_minor_unit, item.prices.currency_prefix);

  return (
    <div className="flex gap-4 border-b border-ink/15 py-6 sm:gap-6">
      <Link
        to={`/shop/products/${item.sku ? item.sku.toLowerCase() : ''}`}
        className="block w-24 shrink-0 bg-ink/5 sm:w-28"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="aspect-[4/5]">
          <ImageWithFallback
            src={image?.src ?? '/media/shop/shop-poster.webp'}
            alt=""
            className="image-cover"
            width={220}
            height={275}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg leading-snug">{item.name}</h3>
            {item.variation.length > 0 && (
              <p className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-ink/45">
                {item.variation.map((variation) => `${variation.attribute}: ${variation.value}`).join(' · ')}
              </p>
            )}
          </div>
          <p className="shrink-0 font-sans text-sm tabular-nums text-ink">{lineTotal}</p>
        </div>

        {item.item_data.length > 0 && (
          <ul className="mt-3 space-y-1 border-l border-terracotta/40 pl-3">
            {item.item_data.map((entry) => (
              <li key={entry.key} className="text-xs leading-relaxed text-ink/55">
                {entry.display || entry.value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <QuantitySelector
            value={quantity}
            min={1}
            onChange={(next) => {
              setQuantity(next);
              onUpdate(item.key, next);
            }}
          />
          <button
            type="button"
            onClick={() => onRemove(item.key)}
            disabled={busy}
            className="inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.18em] text-ink/45 transition-colors hover:text-terracotta disabled:opacity-50"
          >
            <Trash2 className="size-3.5" strokeWidth={1.6} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

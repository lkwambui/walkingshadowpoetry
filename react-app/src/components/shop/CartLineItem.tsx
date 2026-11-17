import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import type { StoreCartItem } from '../../services/storeApi';
import { formatMinor } from '../../services/storeApi';
import ImageWithFallback from '../common/ImageWithFallback';
import PersonalizationSummary from './PersonalizationSummary';
import QuantitySelector from './QuantitySelector';

interface CartLineItemProps {
  item: StoreCartItem;
  onUpdate: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
  busy?: boolean;
  compact?: boolean;
}

function productPath(item: StoreCartItem) {
  try {
    const segments = new URL(item.permalink ?? '', 'https://walkingshadowpoetry.com')
      .pathname.split('/')
      .filter(Boolean);
    const slug = segments[segments.length - 1];
    if (slug && segments.includes('product')) return `/shop/products/${slug}`;
  } catch {
    /* fall through to search */
  }
  return `/shop/search?search=${encodeURIComponent(item.name)}`;
}

export default function CartLineItem({ item, onUpdate, onRemove, busy, compact = false }: CartLineItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const image = item.images[0];
  const lineTotal = formatMinor(item.totals.line_total, item.totals.currency_minor_unit, item.prices.currency_prefix);

  useEffect(() => setQuantity(item.quantity), [item.quantity]);

  return (
    <div className={`flex gap-4 border-b border-ink/15 ${compact ? 'py-4' : 'py-6 sm:gap-6'}`}>
      <Link
        to={productPath(item)}
        className={`block shrink-0 bg-ink/5 ${compact ? 'w-16' : 'w-24 sm:w-28'}`}
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="aspect-[4/5]">
          <ImageWithFallback
            src={image?.thumbnail ?? image?.src ?? '/media/shop/shop-poster.webp'}
            alt=""
            className="image-cover"
            width={compact ? 160 : 220}
            height={compact ? 200 : 275}
            srcSet={image?.thumbnail_srcset || image?.srcset}
            sizes={compact ? '80px' : image?.sizes}
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-display leading-snug ${compact ? 'text-base' : 'text-lg'}`}>
              <Link to={productPath(item)} className="transition-colors hover:text-terracotta">
                {item.name}
              </Link>
            </h3>
            {item.variation.length > 0 && (
              <p className="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-ink/45">
                {item.variation.map((variation) => `${variation.attribute}: ${variation.value}`).join(' · ')}
              </p>
            )}
          </div>
          <p className="shrink-0 font-sans text-sm tabular-nums text-ink">{lineTotal}</p>
        </div>

        {item.item_data.length > 0 && (
          <PersonalizationSummary entries={item.item_data} compact={compact} />
        )}

        <div className="mt-4 flex items-center justify-between gap-4">
          <QuantitySelector
            value={quantity}
            min={1}
            label={`Quantity for ${item.name}`}
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

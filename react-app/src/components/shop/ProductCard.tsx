import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, Plus } from 'lucide-react';
import { cn } from '../../utils/format';
import type { StoreProduct } from '../../services/storeApi';
import { colourAttribute, colourHex, productIsPersonalized, stripHtml } from '../../services/productUtils';
import { useCart } from '../../hooks/useCart';
import { useShopUi } from '../../context/ShopUiProvider';
import { useWishlist } from '../../hooks/useWishlist';
import ImageWithFallback from '../common/ImageWithFallback';
import Price from './Price';

interface ProductCardProps {
  product: StoreProduct;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { openQuickView, openCart } = useShopUi();
  const wishlist = useWishlist();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const colour = colourAttribute(product);
  const isVariable = product.type === 'variable' || product.has_options;
  const personalized = productIsPersonalized(product);
  const saved = wishlist.has(product.id);
  const [primary, secondary] = product.images;

  const quickAdd = async () => {
    if (isVariable) return;
    setAdding(true);
    try {
      await addItem({ id: product.id, quantity: 1 });
      setAdded(true);
      openCart();
      window.setTimeout(() => setAdded(false), 1800);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className={cn('group relative flex flex-col', className)}>
      <div className="relative overflow-hidden bg-ink/5">
        <Link
          to={`/shop/products/${product.slug}`}
          className="block"
          aria-label={`View details for ${product.name}`}
        >
          <div className="aspect-[4/5] w-full">
            <ImageWithFallback
              src={primary?.src ?? '/media/shop/shop-poster.webp'}
              alt={primary?.alt || product.name}
              className={cn(
                'image-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]',
                secondary && 'group-hover:opacity-0',
              )}
              width={800}
              height={1000}
              srcSet={primary?.srcset}
              sizes={primary?.sizes || '(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw'}
            />
            {secondary && (
              <ImageWithFallback
                src={secondary.src}
                alt={secondary.alt || product.name}
                className="image-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                width={800}
                height={1000}
                srcSet={secondary.srcset}
                sizes={secondary.sizes}
              />
            )}
          </div>
        </Link>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {product.on_sale && (
            <span className="bg-terracotta px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-ivory">
              Sale
            </span>
          )}
          {personalized && (
            <span className="bg-ink px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-ivory">
              Personalized
            </span>
          )}
          {product.is_in_stock === false && (
            <span className="bg-ivory px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-ink">
              Sold out
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => wishlist.toggle(product.id)}
            className={cn(
              'flex size-9 items-center justify-center border border-ink/15 bg-ivory/90 backdrop-blur transition-colors hover:bg-ink hover:text-ivory',
              saved && 'border-terracotta bg-terracotta text-ivory hover:bg-terracotta hover:text-ivory',
            )}
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            aria-pressed={saved}
          >
            <Heart className="size-4" strokeWidth={1.6} fill={saved ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex size-9 items-center justify-center border border-ink/15 bg-ivory/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-ivory"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="size-4" strokeWidth={1.6} />
          </button>
          {personalized ? (
            <Link
              to={`/shop/personalized/${product.slug}?product=${product.id}`}
              className="flex size-9 items-center justify-center border border-ink/15 bg-ivory/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-ivory"
              aria-label={`Personalize ${product.name}`}
            >
              <Plus className="size-4 rotate-45" strokeWidth={1.6} />
            </Link>
          ) : (
            !isVariable && product.is_purchasable && product.is_in_stock !== false && (
              <button
                type="button"
                onClick={quickAdd}
                disabled={adding}
                className="flex size-9 items-center justify-center border border-ink/15 bg-ivory/90 text-ink backdrop-blur transition-colors hover:bg-ink hover:text-ivory disabled:opacity-50"
                aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
              >
                <Plus className={cn('size-4 transition-transform', added && 'rotate-45')} strokeWidth={1.6} />
              </button>
            )
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {product.categories[0] && (
          <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
            {product.categories[0].name}
          </p>
        )}
        <h3 className="mt-1.5 font-display text-lg leading-snug">
          <Link
            to={`/shop/products/${product.slug}`}
            className="transition-colors hover:text-terracotta"
          >
            {product.name}
          </Link>
        </h3>

        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/50">
            {stripHtml(product.short_description)}
          </p>
        )}

        <div className="mt-2 flex items-center justify-between gap-3">
          <Price product={product} size="sm" />
          {colour && colour.terms.length > 0 && (
            <div className="flex items-center gap-1.5" aria-hidden="true">
              {colour.terms.slice(0, 4).map((term) => (
                <span
                  key={term.id}
                  className="size-3 border border-ink/20"
                  style={{ backgroundColor: colourHex(term.name) }}
                />
              ))}
            </div>
          )}
        </div>

        <p className="mt-2 text-[0.55rem] uppercase tracking-[0.16em] text-ink/40">
          {product.stock_availability?.text || (product.is_in_stock ? 'In stock' : 'Out of stock')}
        </p>

        <Link
          to={`/shop/products/${product.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-ink/50 transition-colors hover:text-terracotta"
        >
          View details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import type { StoreProduct } from '../../services/storeApi';
import { useCart } from '../../hooks/useCart';
import { useDialog } from '../../hooks/useDialog';
import { useShopUi } from '../../context/ShopUiProvider';
import { useProductVariations } from '../../hooks/useShopData';
import {
  productIsPersonalized,
  resolveVariationId,
  stripHtml,
  variationStock,
} from '../../services/productUtils';
import Price from './Price';
import ProductGallery from './ProductGallery';
import QuantitySelector from './QuantitySelector';
import VariationSelector from './VariationSelector';

interface QuickViewModalProps {
  product: StoreProduct | null;
  onClose: () => void;
}

function defaultSelection(product: StoreProduct) {
  const selection: Record<string, string> = {};
  product.attributes.forEach((attribute) => {
    const preferred = attribute.terms.find((term) => term.default) ?? attribute.terms[0];
    if (preferred) selection[attribute.name] = preferred.slug;
  });
  return selection;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const dialogRef = useDialog(Boolean(product), onClose);
  const { addItem, isMutating } = useCart();
  const { openCart } = useShopUi();
  const variationsQuery = useProductVariations(product?.type === 'variable' ? product.id : undefined);
  const variations = variationsQuery.data ?? [];
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelection(defaultSelection(product));
      setQuantity(1);
      setFeedback(null);
      setError(null);
    }
  }, [product]);

  const variationId = useMemo(
    () => (product ? resolveVariationId(product, variations, selection) : null),
    [product, variations, selection],
  );
  const stock = variationStock(variations, variationId);
  const personalized = product ? productIsPersonalized(product) : false;

  if (!product) return null;

  const handleAdd = async () => {
    setError(null);
    try {
      const variation = product.attributes
        .filter((attribute) => selection[attribute.name])
        .map((attribute) => ({
          attribute: attribute.taxonomy || attribute.name,
          value: selection[attribute.name],
        }));
      await addItem({
        id: product.type === 'variable' && variationId ? variationId : product.id,
        quantity,
        variation,
      });
      setFeedback('Added to cart');
      openCart();
      window.setTimeout(() => setFeedback(null), 2200);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'We could not add this piece to your cart.');
    }
  };

  const canAdd = product.is_purchasable !== false && stock.inStock && !personalized && !isMutating;

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-0 sm:p-6">
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative grid max-h-full w-full max-w-5xl grid-cols-1 overflow-y-auto bg-ivory text-ink shadow-2xl sm:max-h-[92vh] lg:grid-cols-2"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 z-10 flex size-10 items-center justify-center border border-ink/20 bg-ivory/90 transition-colors hover:bg-ink hover:text-ivory"
        >
          <X className="size-4" strokeWidth={1.6} />
        </button>

        <div className="bg-ink/5 p-4 sm:p-8">
          <ProductGallery images={product.images} productName={product.name} compact />
        </div>

        <div className="p-6 sm:p-10 lg:py-12">
          {product.categories[0] && (
            <p className="text-[0.55rem] uppercase tracking-[0.22em] text-terracotta">
              {product.categories[0].name}
            </p>
          )}
          <h2 id="quick-view-title" className="mt-3 font-display text-[clamp(1.8rem,3.5vw,2.8rem)] leading-tight">
            {product.name}
          </h2>
          <div className="mt-4">
            <Price product={product} size="lg" />
          </div>

          {product.short_description && (
            <div className="prose-editorial mt-5 text-sm leading-relaxed text-ink/60">
              {stripHtml(product.short_description)}
            </div>
          )}

          <p
            className={`mt-5 text-[0.6rem] uppercase tracking-[0.18em] ${
              product.is_in_stock ? 'text-green-deep' : 'text-terracotta'
            }`}
          >
            {product.stock_availability?.text || (product.is_in_stock ? 'In stock' : 'Out of stock')}
          </p>

          {personalized ? (
            <div className="mt-8 border border-ink/15 bg-brand-tint/30 p-5">
              <p className="text-sm leading-relaxed text-ink/65">
                This piece is written around your story. Complete the personalization form, then add it to
                your cart with all details attached.
              </p>
              <Link
                to={`/shop/personalized/${product.slug}?product=${product.id}`}
                onClick={onClose}
                className="mt-5 inline-flex items-center justify-center bg-ink px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
              >
                Personalize &amp; add to cart
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <VariationSelector
                attributes={product.attributes}
                selection={selection}
                onChange={(name, value) => {
                  setSelection((current) => ({ ...current, [name]: value }));
                  setFeedback(null);
                }}
              />
              <div className="flex flex-wrap items-center gap-4">
                <QuantitySelector value={quantity} onChange={setQuantity} max={product.add_to_cart?.maximum || 99} />
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className="inline-flex flex-1 items-center justify-center gap-3 bg-ink px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {feedback ? (
                    <>
                      <CheckCircle2 className="size-4" strokeWidth={1.6} />
                      {feedback}
                    </>
                  ) : (
                    'Add to cart'
                  )}
                </button>
              </div>
              {error && <p className="text-xs text-terracotta" role="alert">{error}</p>}
            </div>
          )}

          <Link
            to={`/shop/products/${product.slug}`}
            onClick={onClose}
            className="mt-8 inline-block border-b border-ink/30 pb-1 text-[0.6rem] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-terracotta"
          >
            View full details
          </Link>
        </div>
      </div>
    </div>
  );
}

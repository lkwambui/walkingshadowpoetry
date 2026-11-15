import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Package, RefreshCw, Truck } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import ProductGallery from '../../components/shop/ProductGallery';
import ProductGrid from '../../components/shop/ProductGrid';
import VariationSelector from '../../components/shop/VariationSelector';
import QuantitySelector from '../../components/shop/QuantitySelector';
import Price from '../../components/shop/Price';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import ShopSubnav from '../../components/shop/ShopSubnav';
import { useProduct, useProducts, useProductVariations } from '../../hooks/useShopData';
import { useCart } from '../../hooks/useCart';
import {
  productIsPersonalized,
  resolveVariationId,
  stripHtml,
  variationStock,
} from '../../services/productUtils';
import type { StoreProduct } from '../../services/storeApi';
import { site } from '../../data/site';

function defaultSelection(product: StoreProduct) {
  const selection: Record<string, string> = {};
  product.attributes.forEach((attribute) => {
    if (attribute.terms.length === 0) return;
    const preferred = attribute.terms.find((term) => term.default) ?? attribute.terms[0];
    selection[attribute.name] = preferred.slug;
  });
  return selection;
}

export default function ProductDetail() {
  const { slug = '' } = useParams();
  const { addItem, isMutating } = useCart();

  const productQuery = useProduct(slug);
  const product = productQuery.data ?? null;
  const variationsQuery = useProductVariations(product?.type === 'variable' ? product.id : undefined);
  const variations = variationsQuery.data ?? [];

  const [selection, setSelection] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setSelection(defaultSelection(product));
      setQuantity(1);
    }
  }, [product]);

  const variationId = useMemo(
    () => (product ? resolveVariationId(product, variations, selection) : null),
    [product, variations, selection],
  );

  const stock = variationStock(variations, variationId);
  const personalized = product ? productIsPersonalized(product) : false;
  const canAdd =
    Boolean(product) &&
    !personalized &&
    product?.is_purchasable !== false &&
    stock.inStock;

  const related = useProducts({
    category: product?.categories[0]?.slug,
    perPage: 5,
  });

  const relatedItems = (related.data ?? []).filter((item) => item.id !== product?.id).slice(0, 4);

  if (productQuery.isLoading) {
    return (
      <PageTransition>
        <ShopSubnav />
        <Container className="py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse bg-ink/5" />
            <div className="space-y-5">
              <div className="h-3 w-24 animate-pulse bg-ink/10" />
              <div className="h-10 w-3/4 animate-pulse bg-ink/10" />
              <div className="h-4 w-32 animate-pulse bg-ink/10" />
              <div className="h-24 w-full animate-pulse bg-ink/5" />
            </div>
          </div>
        </Container>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <ShopSubnav />
        <Container className="py-24">
          <ShopEmptyState
            eyebrow="Not found"
            title="We could not find that piece."
            description="It may have been moved, unpublished or renamed in WooCommerce."
            action={
              <Button to="/shop/clothing" variant="dark">
                Back to the collection
              </Button>
            }
          />
        </Container>
      </PageTransition>
    );
  }

  const handleAdd = async () => {
    const variation = product.attributes
      .filter((attribute) => selection[attribute.name])
      .map((attribute) => ({ attribute: attribute.taxonomy || attribute.name, value: selection[attribute.name] }));

    await addItem({
      id: product.type === 'variable' && variationId ? variationId : product.id,
      quantity,
      variation,
    });
    setFeedback('Added to cart');
    window.setTimeout(() => setFeedback(null), 2200);
  };

  const productLd = {
    '@type': 'Product',
    name: product.name,
    description: stripHtml(product.short_description || product.description).slice(0, 300),
    sku: product.sku,
    image: product.images.map((image) => image.src),
    brand: { '@type': 'Brand', name: site.name },
    offers: {
      '@type': 'Offer',
      priceCurrency: product.prices.currency_code,
      price: (Number(product.prices.price) / 10 ** product.prices.currency_minor_unit).toFixed(2),
      availability: product.is_in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${site.url}/shop/products/${product.slug}`,
    },
  };

  return (
    <PageTransition>
      <SEO
        title={product.name}
        description={
          stripHtml(product.short_description || product.description).slice(0, 155) ||
          `${product.name} from the Walking Shadow Poetry shop.`
        }
        path={`/shop/products/${product.slug}`}
        image={product.images[0]?.src}
        type="website"
        jsonLd={[
          productLd,
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
              { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
              {
                '@type': 'ListItem',
                position: 3,
                name: product.categories[0]?.name ?? 'Product',
                item: product.categories[0] ? `${site.url}/shop/categories/${product.categories[0].slug}` : undefined,
              },
              { '@type': 'ListItem', position: 4, name: product.name },
            ],
          },
        ]}
      />

      <ShopSubnav />

      <section className="bg-ivory py-10 text-ink sm:py-14">
        <Container>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              product.categories[0]
                ? { label: product.categories[0].name, path: `/shop/categories/${product.categories[0].slug}` }
                : { label: 'Shop', path: '/shop' },
              { label: product.name },
            ]}
          />

          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <ProductGallery images={product.images} productName={product.name} />
            </div>

            <div className="lg:pt-4">
              {product.categories[0] && (
                <Link
                  to={`/shop/categories/${product.categories[0].slug}`}
                  className="text-[0.58rem] uppercase tracking-[0.22em] text-terracotta transition-colors hover:text-brand-deep"
                >
                  {product.categories[0].name}
                </Link>
              )}
              <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.02]">
                {product.name}
              </h1>

              <div className="mt-5 flex items-center gap-4">
                <Price product={product} size="lg" />
                {product.on_sale && (
                  <span className="bg-terracotta px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.2em] text-ivory">
                    On sale
                  </span>
                )}
              </div>

              {(product.short_description || product.description) && (
                <div className="mt-6 max-w-lg text-sm leading-relaxed text-ink/60">
                  {stripHtml(product.short_description || product.description)}
                </div>
              )}

              <div className="mt-7 flex items-center gap-3">
                <span
                  className={
                    product.is_in_stock
                      ? 'inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-green-deep'
                      : 'inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-terracotta'
                  }
                >
                  <span
                    className={
                      product.is_in_stock
                        ? 'size-2 rounded-full bg-green'
                        : 'size-2 rounded-full bg-terracotta'
                    }
                  />
                  {product.stock_availability?.text || (product.is_in_stock ? 'In stock' : 'Out of stock')}
                </span>
                {variationId && stock.lowStock !== null && stock.lowStock <= 5 && (
                  <span className="text-xs uppercase tracking-[0.16em] text-terracotta">
                    Only {stock.lowStock} left
                  </span>
                )}
              </div>

              {personalized ? (
                <div className="mt-9 border border-ink/15 bg-brand-tint/30 p-6">
                  <p className="eyebrow text-terracotta">Made personal</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/65">
                    This is a personalized piece. Tell us who it is for and the moment it marks, and
                    we will write it for them.
                  </p>
                  <div className="mt-5">
                    <Button to={`/shop/personalized/notes?product=${product.id}`} variant="dark" size="lg">
                      Personalize this piece
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-9 space-y-7">
                  <VariationSelector
                    attributes={product.attributes}
                    selection={selection}
                    onChange={(name, value) => {
                      setSelection((current) => ({ ...current, [name]: value }));
                      setFeedback(null);
                    }}
                  />

                  {product.type === 'variable' && !variationId && Object.keys(selection).length > 0 && (
                    <p className="text-xs text-terracotta">
                      Please choose an available combination of options.
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4">
                    <QuantitySelector value={quantity} onChange={setQuantity} max={product.add_to_cart?.maximum || 99} />
                    <button
                      type="button"
                      onClick={handleAdd}
                      disabled={!canAdd || isMutating}
                      className="inline-flex flex-1 items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {feedback ? (
                        <>
                          <CheckCircle2 className="size-4" strokeWidth={1.6} />
                          {feedback}
                        </>
                      ) : product.is_in_stock === false ? (
                        'Out of stock'
                      ) : (
                        'Add to cart'
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-10 grid gap-5 border-t border-ink/15 pt-8 sm:grid-cols-3">
                {[
                  { icon: Truck, title: 'Nationwide delivery', body: 'Across Kenya via courier.' },
                  { icon: Package, title: 'Made with care', body: 'Prepared and packed by hand.' },
                  { icon: RefreshCw, title: 'Easy returns', body: 'See our returns policy.' },
                ].map((item) => (
                  <div key={item.title}>
                    <item.icon className="size-4 text-terracotta" strokeWidth={1.5} />
                    <h3 className="mt-2.5 text-sm font-medium text-ink">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink/50">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {product.description && product.description !== product.short_description && (
        <section className="border-t border-ink/15 bg-brand-tint/20 py-16 text-ink sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="eyebrow text-terracotta">Details</p>
              </div>
              <div className="max-w-2xl lg:col-span-8 lg:col-start-5">
                <div className="prose-editorial space-y-4 text-sm leading-relaxed text-ink/70">
                  {stripHtml(product.description)
                    .split(/\n{2,}/)
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {relatedItems.length > 0 && (
        <section className="bg-ivory py-20 text-ink sm:py-24">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-[clamp(1.8rem,3.4vw,2.8rem)]">You may also like</h2>
              <Link
                to="/shop/clothing"
                className="hidden items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-terracotta sm:inline-flex"
              >
                View all
                <ChevronRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
            <div className="mt-12">
              <ProductGrid products={relatedItems} columns={4} />
            </div>
          </Container>
        </section>
      )}
    </PageTransition>
  );
}

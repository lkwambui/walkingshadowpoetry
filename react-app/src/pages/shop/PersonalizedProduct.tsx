import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock3, Heart, ShieldCheck } from 'lucide-react';
import Container from '../../components/common/Container';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import PersonalizationForm from '../../components/shop/PersonalizationForm';
import Price from '../../components/shop/Price';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import ShopSubnav from '../../components/shop/ShopSubnav';
import { useProduct, useProducts } from '../../hooks/useShopData';
import { stripHtml } from '../../services/productUtils';
import { site } from '../../data/site';

export default function PersonalizedProduct() {
  const { slug = '' } = useParams();
  const [searchParams] = useSearchParams();
  const productQuery = useProduct(slug);
  const notes = useProducts({ category: 'personalized-notes', perPage: 100 });
  const commissions = useProducts({ category: 'poetry-commissions', perPage: 100 });
  const productId = Number(searchParams.get('product'));

  const products = useMemo(
    () => [...(notes.data ?? []), ...(commissions.data ?? [])],
    [notes.data, commissions.data],
  );

  const product = useMemo(() => {
    const bySlug = productQuery.data;
    if (bySlug) return bySlug;
    if (productId) return products.find((item) => item.id === productId) ?? null;
    return products[0] ?? null;
  }, [productQuery.data, productId, products]);

  const loading = slug ? productQuery.isLoading : notes.isLoading && commissions.isLoading;

  if (loading) {
    return (
      <PageTransition>
        <ShopSubnav />
        <Container className="py-24">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="aspect-[4/5] animate-pulse bg-ink/5 lg:col-span-4" />
            <div className="space-y-5 lg:col-span-7 lg:col-start-6">
              <div className="h-3 w-32 animate-pulse bg-ink/10" />
              <div className="h-10 w-3/4 animate-pulse bg-ink/10" />
              <div className="h-64 w-full animate-pulse bg-ink/5" />
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
            eyebrow="Personalized pieces"
            title="We could not find that piece."
            description="The personalized collection may be updating. Browse the collection and choose a note or poem to begin."
            action={
              <Button to="/shop/personalized" variant="dark">
                View personalized pieces
              </Button>
            }
          />
        </Container>
      </PageTransition>
    );
  }

  const description =
    stripHtml(product.short_description || product.description).slice(0, 155) ||
    'Create a personalized piece written around the person and moment that matter to you.';

  return (
    <PageTransition>
      <SEO
        title={`Personalize — ${product.name}`}
        description={description}
        path={`/shop/personalized/${product.slug}`}
        image={product.images[0]?.src}
        jsonLd={{
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
            url: `${site.url}/shop/personalized/${product.slug}`,
          },
        }}
      />

      <section className="relative isolate overflow-hidden bg-ink pb-14 pt-28 text-ivory sm:pb-16 sm:pt-36">
        <ImageWithFallback
          src={product.images[0]?.src ?? '/media/poetry/my-love-poem.webp'}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/90 to-ink/50" />
        <Container>
          <Breadcrumbs
            tone="dark"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Personalized Pieces', path: '/shop/personalized' },
              { label: product.name },
            ]}
          />
          <div className="mt-10 max-w-3xl">
            <p className="eyebrow text-sand">Made for one person</p>
            <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-[0.98]">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-ivory/70 sm:text-base">
              {description}
            </p>
          </div>
        </Container>
      </section>

      <ShopSubnav />

      <section className="bg-ivory py-12 text-ink sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <PersonalizationForm
                product={product}
                products={products}
                lockedProduct={Boolean(slug)}
              />
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-40">
                <div className="border border-ink/15 bg-brand-tint/20">
                  <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                    <ImageWithFallback
                      src={product.images[0]?.src ?? '/media/shop/shop-poster.webp'}
                      alt={product.images[0]?.alt || product.name}
                      className="h-full w-full object-cover"
                      srcSet={product.images[0]?.srcset}
                      sizes={product.images[0]?.sizes || '(max-width: 1024px) 100vw, 33vw'}
                    />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-terracotta">Your piece</p>
                    <h2 className="mt-2 font-display text-xl">{product.name}</h2>
                    <div className="mt-3">
                      <Price product={product} />
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-ink/55">
                      {product.stock_availability?.text || (product.is_in_stock ? 'Made to order' : 'Currently unavailable')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border border-ink/15 p-6">
                  <h3 className="font-display text-xl">How it works</h3>
                  <ul className="mt-5 space-y-4">
                    {[
                      { icon: Heart, text: 'Share the person and the moment in the form.' },
                      { icon: CheckCircle2, text: 'We write the piece by hand from your details.' },
                      { icon: Clock3, text: 'Allow a few days for writing and preparation.' },
                      { icon: ShieldCheck, text: 'Secure checkout through the shop’s existing gateway.' },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex gap-3 text-sm leading-relaxed text-ink/60">
                        <Icon className="mt-0.5 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-ink/15 pt-5 text-xs leading-relaxed text-ink/55">
                    Need it urgently or have a question?{' '}
                    <a
                      href={site.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-terracotta underline-offset-4"
                    >
                      Message us on WhatsApp
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

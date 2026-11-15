import { ArrowUpRight, Feather, PenLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import PageTransition from '../../components/common/PageTransition';
import Reveal from '../../components/common/Reveal';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import ProductGrid from '../../components/shop/ProductGrid';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { useProducts } from '../../hooks/useShopData';
import { site } from '../../data/site';

const paths = [
  {
    icon: PenLine,
    eyebrow: 'Customized notes',
    title: 'A note written for them.',
    body: 'Share the recipient, the occasion and the feeling. We write a handwritten-style note shaped around their story — digital or printed.',
    to: '/shop/personalized/notes',
    cta: 'Create a note',
  },
  {
    icon: Feather,
    eyebrow: 'Poetry commissions',
    title: 'A poem made for the moment.',
    body: 'Commission a bespoke poem for a birthday, an anniversary, a love, a farewell or a milestone that deserves its own words.',
    to: '/shop/commissions',
    cta: 'Commission a poem',
  },
];

export default function Personalized() {
  const noteProducts = useProducts({ category: 'personalized-notes', perPage: 8 });

  return (
    <PageTransition>
      <SEO
        title="Personalized pieces — notes & commissioned poetry"
        description="Commission personalized handwritten-style notes and bespoke poetry from Walking Shadow Poetry. Words written for the people and occasions that matter."
        path="/shop/personalized"
        image="/media/poetry/my-love-poem.webp"
        jsonLd={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
            { '@type': 'ListItem', position: 3, name: 'Personalized Pieces' },
          ],
        }}
      />

      <section className="relative isolate flex min-h-[62vh] items-end overflow-hidden bg-ink text-ivory">
        <ImageWithFallback
          src="/media/poetry/my-love-poem.webp"
          alt="A commissioned poem from Walking Shadow Poetry"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/55 to-ink/65" />
        <div className="shell w-full pb-16 pt-32">
          <Breadcrumbs
            tone="dark"
            className="mb-12"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Personalized Pieces' },
            ]}
          />
          <p className="eyebrow text-sand">The Personalized Collection</p>
          <h1 className="mt-5 max-w-4xl text-[clamp(2.6rem,7vw,6rem)] leading-[0.92]">
            Some Words Deserve to Be <em className="text-sand">Personal.</em>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ivory/75 sm:text-base">
            Tell us about a person and a moment. We shape the words around them — a personalized
            note or a fully commissioned poem, written by hand and made to be kept.
          </p>
        </div>
      </section>

      <ShopSubnav />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
            {paths.map((path) => (
              <Reveal key={path.to}>
                <Link
                  to={path.to}
                  className="group flex h-full flex-col border border-ink/15 bg-brand-tint/20 p-8 transition-colors hover:border-ink sm:p-10"
                >
                  <path.icon className="size-5 text-terracotta" strokeWidth={1.5} />
                  <p className="eyebrow mt-6 text-ink/45">{path.eyebrow}</p>
                  <h2 className="mt-3 font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-tight">
                    {path.title}
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/60">{path.body}</p>
                  <span className="mt-8 inline-flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-ink">
                    {path.cta}
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.6}
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 border-t border-ink/15 pt-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="eyebrow text-terracotta">Ready to give</p>
                <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.8rem)]">
                  Personalized pieces
                </h2>
              </div>
              <Sparkles className="size-5 text-terracotta" strokeWidth={1.5} />
            </div>

            <div className="mt-12">
              {noteProducts.isLoading ? (
                <ProductGrid products={[]} loading skeletonCount={4} />
              ) : noteProducts.data && noteProducts.data.length > 0 ? (
                <ProductGrid products={noteProducts.data} columns={4} />
              ) : (
                <ShopEmptyState
                  eyebrow="Built to order"
                  title="Every personalized piece is made to order."
                  description="Choose a note or a commission to begin. Each piece is written individually and priced according to its length and detail."
                  action={
                    <Button to="/shop/personalized/notes" variant="dark">
                      Start with a note
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

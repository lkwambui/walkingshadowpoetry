import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Feather, PenLine, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../../components/common/Container';
import ImageWithFallback from '../../components/common/ImageWithFallback';
import PageTransition from '../../components/common/PageTransition';
import Reveal from '../../components/common/Reveal';
import SectionHeading from '../../components/common/SectionHeading';
import SEO from '../../components/common/SEO';
import Button from '../../components/common/Button';
import CategoryGrid from '../../components/shop/CategoryGrid';
import ProductGrid from '../../components/shop/ProductGrid';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import NewsletterForm from '../../components/shop/NewsletterForm';
import { useProducts } from '../../hooks/useShopData';
import { site } from '../../data/site';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Shop' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

export default function ShopHome() {
  const reduceMotion = useReducedMotion();
  const featured = useProducts({ featured: true, perPage: 8 });

  return (
    <PageTransition>
      <SEO
        title="Shop — poetry-inspired merchandise & personalized words"
        description="Wear your words and share your story. Shop poetry-inspired T-shirts, hoodies, sweatshirts and caps, and commission personalized notes and poetry from Walking Shadow Poetry."
        path="/shop"
        image="/media/shop/shop-poster.webp"
        jsonLd={[
          breadcrumbLd,
          {
            '@type': 'CollectionPage',
            name: 'Walking Shadow Poetry Shop',
            description:
              'Poetry-inspired merchandise and personalized literary pieces from Walking Shadow Poetry.',
            url: `${site.url}/shop`,
          },
        ]}
      />

      {/* A. Shop hero */}
      <section className="relative isolate flex min-h-[86vh] items-end overflow-hidden bg-ink text-ivory">
        <ImageWithFallback
          src="/media/shop/shop-poster.webp"
          alt="Walking Shadow Poetry merchandise"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/65" />

        <div className="shell w-full pb-16 pt-32 sm:pb-20 lg:pb-24">
          <motion.p
            className="eyebrow text-sand"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Walking Shadow Shop
          </motion.p>
          <motion.h1
            className="mt-6 max-w-5xl text-[clamp(2.8rem,8vw,7.5rem)] leading-[0.9]"
            initial={reduceMotion ? false : { opacity: 0, y: 26 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            Wear Your Words.
            <br />
            <em className="text-sand">Share Your Story.</em>
          </motion.h1>
          <motion.p
            className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/75 sm:text-base"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.32 }}
          >
            Discover poetry-inspired merchandise and personalized words crafted to make every
            moment meaningful.
          </motion.p>
          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.42 }}
          >
            <Button to="/shop/clothing" variant="primary" size="lg">
              Explore the Collection
            </Button>
            <Button to="/shop/personalized" variant="outline-light" size="lg">
              Create Something Personal
            </Button>
          </motion.div>
        </div>
      </section>

      <ShopSubnav />

      {/* B. Featured categories */}
      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            index="01"
            align="between"
            title={
              <>
                Featured <em className="text-terracotta">categories.</em>
              </>
            }
            description="Clothing to carry the words, and personalized pieces written for the people and moments that matter."
          />
          <Reveal className="mt-14">
            <CategoryGrid />
          </Reveal>
        </Container>
      </section>

      {/* C. Featured products */}
      <section className="border-t border-ink/15 bg-brand-tint/20 py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Selected"
            index="02"
            align="between"
            title={
              <>
                Featured <em className="text-terracotta">pieces.</em>
              </>
            }
            description="A considered selection from the current collection, managed in WooCommerce."
          />

          <div className="mt-14">
            {featured.isLoading ? (
              <ProductGrid products={[]} loading skeletonCount={4} />
            ) : featured.data && featured.data.length > 0 ? (
              <ProductGrid products={featured.data} columns={4} />
            ) : (
              <ShopEmptyState
                eyebrow="Collection in progress"
                title="The first pieces are being prepared."
                description={
                  <>
                    Nothing is available to order yet. New merchandise and personalized pieces will
                    appear here as they are published in WooCommerce. Follow along or get in touch in
                    the meantime.
                  </>
                }
                action={
                  <Button to="/shop/personalized" variant="dark">
                    Explore personalized pieces
                  </Button>
                }
              />
            )}
          </div>
        </Container>
      </section>

      {/* D. The Personalized Collection */}
      <section className="bg-ink py-20 text-ivory sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <p className="eyebrow text-sand">The Personalized Collection</p>
              <h2 className="mt-5 font-display text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.95]">
                Some Words Deserve to Be <em className="text-sand">Personal.</em>
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/65">
                Commission a unique piece written for a person and an occasion that matters — a
                birthday, an anniversary, a love, a friendship, a farewell. Share the details that
                make them who they are, and we will shape the words around them.
              </p>

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {[
                  { icon: PenLine, title: 'Tell us the story', body: 'Name the person, the occasion and the feeling.' },
                  { icon: Feather, title: 'We write it', body: 'A bespoke note or poem, shaped by hand.' },
                  { icon: Sparkles, title: 'Delivered', body: 'Digital or printed, ready to give.' },
                ].map((step) => (
                  <div key={step.title}>
                    <step.icon className="size-4 text-sand" strokeWidth={1.5} />
                    <h3 className="mt-3 font-display text-lg leading-tight">{step.title}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ivory/55">{step.body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button to="/shop/personalized" variant="primary" size="lg">
                  Create Your Piece
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-5 lg:col-start-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-[4/5] overflow-hidden bg-ivory/5">
                  <ImageWithFallback
                    src="/media/poetry/dear-mom.webp"
                    alt="A personalized poem written by Walking Shadow Poetry"
                    className="image-cover"
                    width={600}
                    height={750}
                  />
                </div>
                <div className="mt-10 aspect-[4/5] overflow-hidden bg-ivory/5">
                  <ImageWithFallback
                    src="/media/poetry/my-love-poem.webp"
                    alt="A commissioned love poem"
                    className="image-cover"
                    width={600}
                    height={750}
                  />
                </div>
              </div>
              <p className="mt-4 border-t border-ivory/15 pt-4 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/40">
                Written by hand · For people and occasions that matter
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* E. Brand story */}
      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-4">
              <div className="aspect-[3/4] overflow-hidden bg-ink/5">
                <ImageWithFallback
                  src="/media/about/about-portrait.webp"
                  alt="Precious Owoko, founder of Walking Shadow Poetry"
                  className="image-cover"
                  width={700}
                  height={930}
                />
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-7 lg:col-start-6">
              <p className="eyebrow text-terracotta">The story behind the shop</p>
              <h2 className="mt-5 font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-[0.98]">
                Poetry, made <em className="text-terracotta">tangible.</em>
              </h2>
              <div className="mt-6 max-w-xl space-y-4 text-sm leading-relaxed text-ink/60">
                <p>
                  Walking Shadow Poetry began in Nakuru with a simple conviction: words can help
                  people grow from what is meant to kill them. For years that work lived in rooms, on
                  stages and on screens.
                </p>
                <p>
                  The shop carries it further. Every piece is an extension of the writing — clothing
                  that wears the words, and personalized notes and poems written for someone real.
                  Nothing here is generic. It is made alongside the poetry, by the same hands.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  Read our story
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  Talk to us
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* F. Newsletter */}
      <section className="border-t border-ink/15 bg-brand py-16 text-ink sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow text-ink/60">Stay close</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] leading-[0.98]">
                New collections, poetry releases and quiet announcements.
              </h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <NewsletterForm tone="light" source="shop-home" />
              <p className="mt-4 text-xs leading-relaxed text-ink/60">
                Be the first to hear about new merchandise, poetry releases, special offers and
                personalized collections. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

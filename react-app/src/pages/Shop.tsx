import { ArrowUpRight, BookOpen, Feather, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import { site } from '../data/site';

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

const expectations = [
  {
    icon: BookOpen,
    title: 'Printed poetry',
    description: 'Selected pieces, kept for the page rather than the scroll.',
  },
  {
    icon: Feather,
    title: 'Small editions',
    description: 'Considered objects made alongside the writing.',
  },
  {
    icon: Package,
    title: 'Made with care',
    description: 'A small shop, prepared slowly and announced honestly.',
  },
];

export default function Shop() {
  return (
    <PageTransition>
      <SEO
        title="Shop — Coming soon"
        description="The Walking Shadow Poetry shop is being prepared. Printed poetry and small editions will be announced here when they are ready."
        path="/shop"
        image="/media/shop/shop-poster.webp"
        jsonLd={breadcrumbLd}
        noindex
      />

      <PageHero
        eyebrow="Shop"
        title={
          <>
            Objects for <em className="text-sand">the words.</em>
          </>
        }
        intro="A small shop is being prepared. Printed poetry and considered objects, made alongside the writing."
        image="/media/shop/shop-poster.webp"
        imageAlt="Walking Shadow Poetry shop poster"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <p className="eyebrow text-terracotta">In preparation</p>
              <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.94]">
                The shop is not open yet.
              </h2>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
                Walking Shadow Poetry is preparing a small collection of printed work and objects.
                Nothing is available to order yet, and no dates have been announced.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
                When the first collection is ready, it will be shared here and on our social
                channels. If you would like to ask about prints or a future collaboration, write to
                us directly.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
                >
                  Enquire about prints
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                </Link>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-ink/30 px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                >
                  Follow for updates
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                </a>
              </div>

              <div className="mt-12 grid gap-6 border-t border-ink/15 pt-8 sm:grid-cols-3">
                {expectations.map((item) => (
                  <div key={item.title}>
                    <item.icon className="size-4 text-terracotta" strokeWidth={1.5} />
                    <h3 className="mt-3 font-display text-xl leading-tight">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-ink/50">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28">
                <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                  <ImageWithFallback
                    src="/media/shop/shop-poster.webp"
                    alt="A Walking Shadow Poetry shop poster"
                    className="image-cover"
                    width={1200}
                    height={1500}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-ink/15 pt-4">
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                    Walking Shadow Poetry
                  </p>
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] text-terracotta">
                    Coming soon
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-20 border-t border-ink/15 pt-10">
              <p className="eyebrow text-terracotta">While you wait</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { to: '/poetry', label: 'Read the poetry' },
                  { to: '/journal', label: 'Browse the journal' },
                  { to: '/episodes', label: 'Watch the episodes' },
                ].map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group flex items-center justify-between border-t border-ink/15 py-4 text-sm text-ink/65 transition-colors hover:text-terracotta"
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      strokeWidth={1.5}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </PageTransition>
  );
}

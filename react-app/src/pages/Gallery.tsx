import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Container from '../components/common/Container';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import Lightbox from '../components/gallery/Lightbox';
import MasonryGallery from '../components/gallery/MasonryGallery';
import { galleryCategories, galleryItems } from '../data/gallery';
import { site } from '../data/site';
import { cn } from '../utils/format';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Gallery' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

export default function Gallery() {
  const [category, setCategory] = useState<(typeof galleryCategories)[number]>('All');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      category === 'All'
        ? galleryItems
        : galleryItems.filter((item) => item.category === category),
    [category],
  );

  return (
    <PageTransition>
      <SEO
        title="Gallery — Moments from the archive"
        description="A visual archive of Walking Shadow Poetry: performances, portraits, campaigns and moments from the Tukuza and FEMA Awards."
        path="/gallery"
        image="/media/gallery/gallery-hero.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow="The visual archive"
        title={
          <>
            Moments that <em className="text-sand">stay.</em>
          </>
        }
        intro="Portraits, performances and the rooms in between. A growing visual record of Walking Shadow Poetry."
        image="/media/gallery/gallery-hero.webp"
        imageAlt="A Walking Shadow Poetry portrait from the archive"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-col gap-6 border-b border-ink/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="eyebrow text-terracotta">Browse the archive</p>
                <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                  The gallery
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-ink/50">
                Select any image to open it in full. Use the arrow keys to move through the archive.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
                {galleryCategories.map((item) => {
                  const active = category === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setCategory(item);
                        setActiveIndex(null);
                      }}
                      aria-pressed={active}
                      className={cn(
                        'border px-4 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
                        active
                          ? 'border-ink bg-ink text-ivory'
                          : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink',
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
              <span className="text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
                {filtered.length} {filtered.length === 1 ? 'image' : 'images'}
              </span>
            </div>
          </Reveal>

          <Reveal>
            <MasonryGallery items={filtered} onSelect={setActiveIndex} />
          </Reveal>

          <Reveal>
            <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-ink/15 pt-10 sm:flex-row sm:items-center">
              <div>
                <p className="eyebrow text-terracotta">Follow the work</p>
                <p className="mt-3 max-w-md font-display text-2xl leading-tight sm:text-3xl">
                  New images and moments are shared on Instagram.
                </p>
              </div>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-ink px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
              >
                Visit Instagram
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </a>
            </div>
          </Reveal>
        </Container>
      </section>

      {activeIndex !== null && (
        <Lightbox
          items={filtered}
          index={activeIndex}
          onClose={() => setActiveIndex(null)}
          onChange={setActiveIndex}
        />
      )}
    </PageTransition>
  );
}

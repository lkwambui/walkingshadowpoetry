import { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import PoetryCard from '../components/poetry/PoetryCard';
import PoetryFilters from '../components/poetry/PoetryFilters';
import { poemCategories, poems } from '../data/poems';
import { site } from '../data/site';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Poetry' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

const sortedPoems = [...poems].sort(
  (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
);

export default function Poetry() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const featured = poems.find((poem) => poem.slug === 'relationships') ?? poems[0];
  const showFeatured = category === 'All' && search.trim() === '';

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedPoems.filter((poem) => {
      const matchesCategory = category === 'All' || poem.category === category;
      const matchesSearch =
        query === '' ||
        poem.title.toLowerCase().includes(query) ||
        poem.category.toLowerCase().includes(query) ||
        poem.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const listed = showFeatured
    ? filtered.filter((poem) => poem.slug !== featured?.slug)
    : filtered;

  return (
    <PageTransition>
      <SEO
        title="Poetry — Words that carry weight"
        description="Read poems and spoken-word pieces from Walking Shadow Poetry. Full text, performance recordings, categories and the stories behind the words."
        path="/poetry"
        image="/media/poetry/poetry-hero.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow="Poetry & spoken word"
        title={
          <>
            Words that <em className="text-sand">carry weight.</em>
          </>
        }
        intro="Poems written to be read, performed to be felt. Browse the published work and the pieces that live in performance."
        image="/media/poetry/poetry-hero.webp"
        imageAlt="A Walking Shadow Poetry performance portrait"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28 lg:py-32">
        <Container>
          {showFeatured && featured && (
            <Reveal>
              <Link
                to={`/poetry/${featured.slug}`}
                className="group mb-16 grid items-center gap-10 border-b border-ink/15 pb-16 sm:mb-24 lg:grid-cols-12 lg:gap-12 lg:pb-24"
              >
                <div className="lg:col-span-6">
                  <p className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.58rem] uppercase tracking-[0.2em] text-ink/40">
                    <span className="text-terracotta">Featured piece</span>
                    <span className="size-1 bg-ink/20" aria-hidden="true" />
                    <span>{featured.date}</span>
                  </p>
                  <h2 className="max-w-xl font-display text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[0.94] transition-colors group-hover:text-terracotta">
                    {featured.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/60">
                    {featured.excerpt}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.64rem] uppercase tracking-[0.2em] transition-colors group-hover:border-brand group-hover:text-terracotta">
                    Read the piece
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </span>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                    <ImageWithFallback
                      src={featured.image}
                      alt={featured.imageAlt}
                      className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      width={1400}
                      height={933}
                    />
                    <span className="absolute left-4 top-4 bg-ink/85 px-3 py-2 text-[0.5rem] uppercase tracking-[0.18em] text-ivory">
                      {featured.category}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          <Reveal>
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-terracotta">The collection</p>
                <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                  Browse the work
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-ink/50">
                Performance-only pieces are marked and link to their original recording. Full text
                is preserved with its original line breaks.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <PoetryFilters
              categories={poemCategories}
              activeCategory={category}
              onCategoryChange={setCategory}
              search={search}
              onSearchChange={setSearch}
              count={listed.length}
            />
          </Reveal>

          <div className="mt-2">
            {listed.map((poem, index) => (
              <Reveal key={poem.slug} delay={Math.min(index * 0.03, 0.18)}>
                <PoetryCard poem={poem} index={index} />
              </Reveal>
            ))}
          </div>

          {listed.length === 0 && (
            <div className="border-t border-ink/15 py-20 text-center">
              <p className="font-display text-4xl">No pieces found.</p>
              <p className="mt-3 text-sm text-ink/55">
                Try a different category or search term.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory('All');
                  setSearch('');
                }}
                className="mt-7 border border-ink px-6 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
              >
                Clear filters
              </button>
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

import { useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import ArticleCard from '../components/journal/ArticleCard';
import { articles } from '../data/articles';
import { site } from '../data/site';
import { cn } from '../utils/format';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Journal' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

const sortedArticles = [...articles].sort(
  (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
);

const categories = Array.from(new Set(articles.map((article) => article.category)));

export default function Journal() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const featured = sortedArticles[0];
  const showFeatured = category === 'All' && search.trim() === '';

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortedArticles.filter((article) => {
      const matchesCategory = category === 'All' || article.category === category;
      const matchesSearch =
        query === '' ||
        article.title.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const listed = showFeatured
    ? filtered.filter((article) => article.slug !== featured?.slug)
    : filtered;

  return (
    <PageTransition>
      <SEO
        title="Journal — Notes from a walking shadow"
        description="Long-form writing from Walking Shadow Poetry on love, resilience, faith and the human experience. Read the full journal archive."
        path="/journal"
        image="/media/journal/journal-hero.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow="The journal"
        title={
          <>
            Notes from a <em className="text-sand">walking shadow.</em>
          </>
        }
        intro="Long-form reflections on love, resilience, faith and the things we carry. Written to be sat with, not scrolled past."
        image="/media/journal/journal-hero.webp"
        imageAlt="A Walking Shadow Poetry portrait from the journal archive"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          {showFeatured && featured && (
            <Reveal>
              <Link
                to={`/journal/${featured.slug}`}
                className="group mb-16 grid items-center gap-10 border-b border-ink/15 pb-16 sm:mb-24 lg:grid-cols-12 lg:gap-12 lg:pb-24"
              >
                <div className="lg:col-span-7">
                  <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                    <ImageWithFallback
                      src={featured.image}
                      alt={featured.imageAlt}
                      className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      width={1400}
                      height={1050}
                    />
                  </div>
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-terracotta">
                    Latest entry
                  </p>
                  <h2 className="mt-4 font-display text-[clamp(2.3rem,4.2vw,4.2rem)] leading-[0.95] transition-colors group-hover:text-terracotta">
                    {featured.title}
                  </h2>
                  <p className="mt-5 text-sm leading-relaxed text-ink/60">{featured.excerpt}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
                    <span>{featured.date}</span>
                    <span className="size-1 bg-ink/20" aria-hidden="true" />
                    <span>{featured.readTime} min read</span>
                  </div>
                  <span className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-colors group-hover:border-brand group-hover:text-terracotta">
                    Read the entry
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <Reveal>
            <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-terracotta">The archive</p>
                <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                  All entries
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-ink/50">
                Essays, reflections and notes from the Walking Shadow Poetry archive.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="border-y border-ink/15 py-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filter journal by category">
                  {['All', ...categories].map((item) => {
                    const active = category === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        aria-pressed={active}
                        className={cn(
                          'shrink-0 border px-4 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
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

                <div className="flex items-center gap-4">
                  <label className="relative flex w-full items-center sm:w-64">
                    <span className="sr-only">Search journal</span>
                    <Search className="pointer-events-none absolute left-0 size-4 text-ink/35" strokeWidth={1.5} />
                    <input
                      type="search"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search the journal"
                      className="w-full border-b border-ink/25 bg-transparent py-2 pl-7 pr-7 text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                    />
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="absolute right-0 text-ink/40 transition-colors hover:text-ink"
                        aria-label="Clear search"
                      >
                        <X className="size-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </label>
                  <span className="shrink-0 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
                    {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
            {listed.map((article, index) => (
              <Reveal key={article.slug} delay={Math.min(index * 0.05, 0.2)}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>

          {listed.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-4xl">No entries found.</p>
              <p className="mt-3 text-sm text-ink/55">Try a different category or search term.</p>
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

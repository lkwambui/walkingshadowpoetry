import { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import WordPressPostCard from '../components/episodes/WordPressPostCard';
import WordPressPostSkeleton from '../components/episodes/WordPressPostSkeleton';
import { useWordPressCategories, useWordPressPosts } from '../hooks/useWordPressPosts';
import {
  getFeaturedImage,
  getPostCategories,
  getPostExcerpt,
  getPostTitle,
} from '../services/wordpress';
import { site } from '../data/site';
import { cn } from '../utils/format';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Episodes' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

export default function Episodes() {
  const [categoryId, setCategoryId] = useState<number>();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { categories, error: categoriesError } = useWordPressCategories();
  const {
    posts,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
  } = useWordPressPosts(debouncedSearch, categoryId);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const showFeatured = categoryId === undefined && debouncedSearch === '';
  const featured = showFeatured ? posts[0] : undefined;
  const listed = useMemo(
    () => (featured ? posts.slice(1) : posts),
    [featured, posts],
  );
  const featuredImage = featured ? getFeaturedImage(featured, 'large') : null;
  const featuredCategory = featured ? getPostCategories(featured)[0]?.name : undefined;

  return (
    <PageTransition>
      <SEO
        title="Stories, Words & Expressions"
        description="Explore stories, reflections and creative expressions from Walking Shadow Poetry."
        path="/episodes"
        image="/media/journal/journal-hero.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow="The Walking Shadow journal"
        title={
          <>
            Stories, Words <em className="text-sand">& Expressions</em>
          </>
        }
        intro="Explore stories, reflections and creative expressions from Walking Shadow Poetry."
        image="/media/journal/journal-hero.webp"
        imageAlt="Walking Shadow Poetry journal"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          {error && posts.length === 0 ? (
            <div className="border-y border-ink/15 py-20 text-center" role="alert">
              <p className="font-display text-3xl sm:text-4xl">Stories could not be loaded.</p>
              <p className="mx-auto mt-3 max-w-lg text-sm text-ink/55">
                The Walking Shadow archive is temporarily unavailable. Please try again.
              </p>
              <button
                type="button"
                onClick={retry}
                className="mt-7 border border-ink px-6 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {featured && (
                <Reveal>
                  <article className="mb-16 grid gap-8 border-b border-ink/15 pb-16 sm:mb-24 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-24">
                    <Link
                      to={`/episodes/${featured.slug}`}
                      className="group lg:col-span-7"
                      aria-label={`Read ${getPostTitle(featured)}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                        {featuredImage ? (
                          <ImageWithFallback
                            src={featuredImage.url}
                            alt={featuredImage.alt}
                            className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                            width={featuredImage.width ?? 1400}
                            height={featuredImage.height ?? 1050}
                            loading="eager"
                          />
                        ) : (
                          <div className="flex h-full items-end bg-brown p-8 text-ivory/70">
                            <span className="font-display text-4xl italic">Walking Shadow</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="lg:col-span-4 lg:col-start-9">
                      <p className="text-[0.58rem] uppercase tracking-[0.2em] text-terracotta">
                        Latest story
                      </p>
                      <h2 className="mt-4 font-display text-[clamp(2.3rem,4vw,4rem)] leading-[0.98]">
                        <Link
                          to={`/episodes/${featured.slug}`}
                          className="transition-colors hover:text-terracotta"
                        >
                          {getPostTitle(featured)}
                        </Link>
                      </h2>
                      <p className="mt-5 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-ink/60">
                        {getPostExcerpt(featured)}
                      </p>
                      <p className="mt-5 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
                        {[featuredCategory, formatDate(featured.date)].filter(Boolean).join(' · ')}
                      </p>
                      <Link
                        to={`/episodes/${featured.slug}`}
                        className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:border-terracotta hover:text-terracotta"
                      >
                        Read the story
                        <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )}

              <Reveal>
                <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow text-terracotta">The archive</p>
                    <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                      Latest stories
                    </h2>
                  </div>
                  <p className="max-w-sm text-xs leading-relaxed text-ink/50">
                    Writing and creative expression from the Walking Shadow Poetry community.
                  </p>
                </div>
              </Reveal>

              <Reveal>
                <div className="border-y border-ink/15 py-6">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div
                      className="no-scrollbar flex gap-2 overflow-x-auto pb-1"
                      role="group"
                      aria-label="Filter stories by category"
                    >
                      {[{ id: undefined, name: 'All' }, ...categories].map((item) => {
                        const active = categoryId === item.id;
                        return (
                          <button
                            key={item.id ?? 'all'}
                            type="button"
                            onClick={() => setCategoryId(item.id)}
                            aria-pressed={active}
                            className={cn(
                              'shrink-0 border px-4 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
                              active
                                ? 'border-ink bg-ink text-ivory'
                                : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink',
                            )}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="relative flex w-full items-center sm:w-64">
                        <span className="sr-only">Search stories</span>
                        <Search className="pointer-events-none absolute left-0 size-4 text-ink/35" strokeWidth={1.5} />
                        <input
                          type="search"
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder="Search stories"
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
                        {loading ? 'Loading' : `${total} ${total === 1 ? 'story' : 'stories'}`}
                      </span>
                    </div>
                  </div>
                  {categoriesError && (
                    <p className="mt-4 text-xs text-ink/45">
                      Categories are temporarily unavailable; you can still browse and search all stories.
                    </p>
                  )}
                </div>
              </Reveal>

              {loading ? (
                <div
                  className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3"
                  aria-label="Loading stories"
                  aria-busy="true"
                >
                  {Array.from({ length: 6 }, (_, index) => <WordPressPostSkeleton key={index} />)}
                </div>
              ) : listed.length > 0 ? (
                <div className="mt-12 grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-16 lg:grid-cols-3">
                  {listed.map((post, index) => (
                    <Reveal key={post.id} delay={Math.min(index * 0.05, 0.2)}>
                      <WordPressPostCard post={post} />
                    </Reveal>
                  ))}
                </div>
              ) : !featured ? (
                <div className="py-20 text-center">
                  <p className="font-display text-4xl">
                    {search || categoryId !== undefined ? 'No stories found.' : 'The archive is waiting.'}
                  </p>
                  <p className="mt-3 text-sm text-ink/55">
                    {search || categoryId !== undefined
                      ? 'Try another search or category.'
                      : 'Published stories will appear here.'}
                  </p>
                  {(search || categoryId !== undefined) && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryId(undefined);
                        setSearch('');
                      }}
                      className="mt-7 border border-ink px-6 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : null}

              {error && posts.length > 0 && (
                <div className="mt-10 border-y border-ink/15 py-5 text-center" role="alert">
                  <p className="text-sm text-ink/65">More stories could not be loaded.</p>
                  <button
                    type="button"
                    onClick={retry}
                    className="mt-3 text-[0.6rem] uppercase tracking-[0.18em] text-terracotta"
                  >
                    Retry
                  </button>
                </div>
              )}

              {hasMore && !loading && !error && (
                <div className="mt-16 text-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="border border-ink px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory disabled:cursor-wait disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading stories…' : 'Load more stories'}
                  </button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

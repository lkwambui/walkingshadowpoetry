import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageTransition from '../components/common/PageTransition';
import ReadingProgress from '../components/common/ReadingProgress';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import ShareLinks from '../components/common/ShareLinks';
import WordPressContent from '../components/episodes/WordPressContent';
import WordPressPostCard, { formatDate } from '../components/episodes/WordPressPostCard';
import WordPressPostSkeleton from '../components/episodes/WordPressPostSkeleton';
import {
  clearWordPressCache,
  getFeaturedImage,
  getPostBySlug,
  getPostCategories,
  getPostExcerpt,
  getPostTitle,
  getRelatedPosts,
  type WPPost,
} from '../services/wordpress';
import { site } from '../data/site';

export default function WordPressPostDetail() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<WPPost | null>(null);
  const [related, setRelated] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPost(null);
    setRelated([]);

    getPostBySlug(slug).then(async (item) => {
      if (!active) return;
      setPost(item);
      setLoading(false);
      if (!item) return;

      try {
        const relatedPosts = await getRelatedPosts(item);
        if (active) setRelated(relatedPosts);
      } catch (reason) {
        if (active) console.error('Unable to load related WordPress posts.', reason);
      }
    }).catch((reason: unknown) => {
      console.error('Unable to load WordPress post.', reason);
      if (!active) return;
      setError(reason instanceof Error ? reason : new Error('Unable to load this story.'));
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [slug, attempt]);

  if (loading) {
    return (
      <PageTransition>
        <section className="bg-ivory pb-20 pt-32 text-ink sm:pt-40">
          <Container>
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="aspect-[16/9] animate-pulse bg-ink/10" />
                <div className="mt-8 h-12 w-4/5 animate-pulse bg-ink/10" />
                <div className="mt-4 h-5 w-2/3 animate-pulse bg-ink/10" />
              </div>
              <div className="lg:col-span-3 lg:col-start-10">
                <WordPressPostSkeleton />
              </div>
            </div>
          </Container>
        </section>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <section className="bg-ivory py-40 text-center text-ink" role="alert">
          <Container>
            <h1 className="font-display text-4xl">This story could not be loaded.</h1>
            <p className="mt-3 text-sm text-ink/55">
              The Walking Shadow archive is temporarily unavailable.
            </p>
            <div className="mt-7 flex justify-center gap-6">
              <button
                type="button"
                onClick={() => {
                  clearWordPressCache();
                  setAttempt((value) => value + 1);
                }}
                className="border border-ink px-6 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
              >
                Retry
              </button>
              <Link
                to="/episodes"
                className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink/60"
              >
                <ArrowLeft className="size-3.5" />
                All stories
              </Link>
            </div>
          </Container>
        </section>
      </PageTransition>
    );
  }

  if (!post) {
    return (
      <PageTransition>
        <section className="bg-ivory py-40 text-center text-ink">
          <Container>
            <h1 className="font-display text-4xl">Story not found.</h1>
            <p className="mt-3 text-sm text-ink/55">
              This post may have been unpublished or moved.
            </p>
            <Link
              to="/episodes"
              className="mt-7 inline-flex items-center gap-2 border border-ink px-6 py-3 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:bg-ink hover:text-ivory"
            >
              <ArrowLeft className="size-3.5" />
              Browse all stories
            </Link>
          </Container>
        </section>
      </PageTransition>
    );
  }

  const title = getPostTitle(post);
  const excerpt = getPostExcerpt(post);
  const categories = getPostCategories(post);
  const image = getFeaturedImage(post, 'large');
  const path = `/episodes/${post.slug}`;
  const canonical = `${site.url}${path}`;
  const jsonLd = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Episodes', item: `${site.url}/episodes` },
        { '@type': 'ListItem', position: 3, name: title, item: canonical },
      ],
    },
    {
      '@type': 'Article',
      headline: title,
      description: excerpt,
      datePublished: post.date,
      articleSection: categories.map((category) => category.name),
      author: { '@type': 'Organization', name: site.name, url: site.url },
      publisher: { '@type': 'Organization', name: site.name, url: site.url },
      ...(image ? { image: image.url } : {}),
      mainEntityOfPage: canonical,
      isAccessibleForFree: true,
    },
  ];

  return (
    <PageTransition>
      <SEO
        title={title}
        description={excerpt || title}
        path={path}
        image={image?.url}
        type="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress />

      <article className="bg-ivory pt-28 text-ink sm:pt-32">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', path: '/' }, { label: 'Episodes', path: '/episodes' }, { label: title }]}
            tone="light"
            className="mb-12"
          />

          <div className="mx-auto max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">
              {categories[0] && <span className="text-terracotta">{categories[0].name}</span>}
              <span>{formatDate(post.date)}</span>
            </div>
            <h1 className="text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.94]">{title}</h1>
            {excerpt && (
              <p className="mt-6 max-w-2xl whitespace-pre-line font-display text-xl leading-relaxed text-ink/60 sm:text-2xl">
                {excerpt}
              </p>
            )}
            <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/episodes"
                className="inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/55 transition-colors hover:text-terracotta"
              >
                <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                All stories
              </Link>
              <ShareLinks title={title} url={canonical} />
            </div>
          </div>

          <div className="mt-12 aspect-[16/9] overflow-hidden bg-ink/5">
            {image ? (
              <ImageWithFallback
                src={image.url}
                alt={image.alt}
                className="image-cover"
                width={image.width ?? 1600}
                height={image.height ?? 900}
                loading="eager"
              />
            ) : (
              <div
                role="img"
                aria-label="No featured image available"
                className="flex h-full items-end bg-brown p-8 text-ivory/70"
              >
                <span className="font-display text-4xl italic">Walking Shadow</span>
              </div>
            )}
          </div>

          <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
            <aside className="lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Filed under</p>
                  <p className="text-sm text-ink/65">
                    {categories.length ? categories.map((category) => category.name).join(', ') : 'Walking Shadow Poetry'}
                  </p>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Published</p>
                  <p className="text-sm text-ink/65">{formatDate(post.date)}</p>
                </div>
              </div>
            </aside>

            <div className="min-w-0 lg:col-span-8 lg:col-start-5">
              <WordPressContent html={post.content.rendered} />
              <div className="mt-14 border-t border-ink/15 pt-8">
                <ShareLinks title={title} url={canonical} />
              </div>
            </div>
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <section className="bg-ivory py-20 text-ink sm:py-28">
          <Container>
            <Reveal>
              <div className="mb-10 flex flex-col gap-4 border-b border-ink/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow text-terracotta">Keep reading</p>
                  <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                    More stories
                  </h2>
                </div>
                <Link
                  to="/episodes"
                  className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
                >
                  All stories
                  <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={0.06 * index}>
                  <WordPressPostCard post={item} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}
    </PageTransition>
  );
}

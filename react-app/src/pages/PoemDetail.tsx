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
import { poems } from '../data/poems';
import { site } from '../data/site';
import { absoluteUrl } from '../utils/format';
import NotFound from './NotFound';

export default function PoemDetail() {
  const { slug } = useParams();
  const poem = poems.find((item) => item.slug === slug);

  if (!poem) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Poetry', path: '/poetry' },
    { label: poem.title },
  ];

  const related = poems
    .filter((item) => item.slug !== poem.slug)
    .sort(
      (a, b) =>
        Number(b.category === poem.category) - Number(a.category === poem.category),
    )
    .slice(0, 3);

  const jsonLd = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        ...(item.path ? { item: `${site.url}${item.path}` } : {}),
      })),
    },
    {
      '@type': 'Article',
      headline: poem.title,
      description: poem.excerpt,
      datePublished: poem.dateISO,
      articleSection: poem.category,
      author: { '@type': 'Organization', name: site.name, url: site.url },
      publisher: { '@type': 'Organization', name: site.name, url: site.url },
      image: absoluteUrl(poem.image, site.url),
      mainEntityOfPage: `${site.url}/poetry/${poem.slug}`,
      isAccessibleForFree: true,
    },
  ];

  return (
    <PageTransition>
      <SEO
        title={poem.title}
        description={poem.excerpt}
        path={`/poetry/${poem.slug}`}
        image={poem.image}
        type="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress />

      <article className="bg-ivory pt-28 text-ink sm:pt-32">
        <Container>
          <Breadcrumbs items={breadcrumbs} tone="light" className="mb-12" />

          <div className="grid gap-10 border-b border-ink/15 pb-14 lg:grid-cols-12 lg:gap-12 lg:pb-20">
            <div className="lg:col-span-7">
              <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">
                <span className="text-terracotta">{poem.category}</span>
                <span className="size-1 bg-ink/20" aria-hidden="true" />
                <span>{poem.date}</span>
                <span className="size-1 bg-ink/20" aria-hidden="true" />
                <span>{poem.readTime} min read</span>
              </div>
              <h1 className="max-w-3xl text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[0.9]">
                {poem.title}
              </h1>
              <p className="mt-6 text-[0.6rem] uppercase tracking-[0.2em] text-ink/45">
                Walking Shadow Poetry <span className="mx-2 text-terracotta">·</span> Nakuru, Kenya
              </p>
              <ShareLinks title={poem.title} className="mt-8" />
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="aspect-[4/5] overflow-hidden bg-ink/5">
                <ImageWithFallback
                  src={poem.image}
                  alt={poem.imageAlt}
                  className="image-cover"
                  width={1200}
                  height={1500}
                  loading="eager"
                />
              </div>
              <p className="mt-3 text-[0.55rem] uppercase tracking-[0.18em] text-ink/35">
                From the Walking Shadow Poetry archive
              </p>
            </div>
          </div>

          <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
            <aside className="lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Category</p>
                  <p className="text-sm text-ink/65">{poem.category}</p>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Published</p>
                  <p className="text-sm text-ink/65">{poem.date}</p>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Reading time</p>
                  <p className="text-sm text-ink/65">{poem.readTime} minutes</p>
                </div>
                <Link
                  to="/poetry"
                  className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-terracotta"
                >
                  <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                  All poetry
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-8 lg:col-start-5">
              {poem.body ? (
                <div className="max-w-3xl">
                  {(() => {
                    const stanzaic =
                      poem.body.filter((entry) => entry.includes('\n')).length >=
                      poem.body.length / 2;
                    return (
                      <p className="whitespace-pre-line font-display text-[1.35rem] leading-[1.75] text-ink/85 sm:text-[1.55rem] sm:leading-[1.8]">
                        {poem.body.join(stanzaic ? '\n\n' : '\n')}
                      </p>
                    );
                  })()}
                  <p className="mt-14 border-t border-ink/15 pt-6 font-display text-2xl italic text-ink/55">
                    — Walking Shadow Poetry
                  </p>
                </div>
              ) : (
                <div className="max-w-3xl border-y border-ink/15 py-10">
                  <p className="eyebrow text-terracotta">A performance piece</p>
                  <blockquote className="mt-6 font-display text-[clamp(1.8rem,3.2vw,2.8rem)] italic leading-[1.25] text-ink/80">
                    “{poem.excerpt}”
                  </blockquote>
                  <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60">
                    {poem.performanceNote ??
                      'This piece was published as a performance recording. The full text is not reproduced here.'}
                  </p>
                  {poem.externalUrl && (
                    <a
                      href={poem.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-3 bg-ink px-6 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
                    >
                      Watch the performance
                      <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              )}

              <div className="mt-14 border-t border-ink/15 pt-8">
                <ShareLinks title={poem.title} />
              </div>
            </div>
          </div>
        </Container>
      </article>

      <section className="bg-ink py-20 text-ivory sm:py-28">
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-col gap-4 border-b border-ivory/12 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-sand">Keep reading</p>
                <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                  Related pieces
                </h2>
              </div>
              <Link
                to="/poetry"
                className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-ivory"
              >
                All poetry
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={0.06 * index}>
                <Link to={`/poetry/${item.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-ivory/5">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.imageAlt}
                      className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                      width={800}
                      height={1000}
                    />
                  </div>
                  <p className="mt-4 text-[0.55rem] uppercase tracking-[0.2em] text-sand">
                    {item.category}
                  </p>
                  <h3 className="mt-2 font-display text-2xl leading-tight transition-colors group-hover:text-sand">
                    {item.title}
                  </h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

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
import { articles } from '../data/articles';
import { site } from '../data/site';
import { absoluteUrl } from '../utils/format';
import NotFound from './NotFound';

export default function ArticleDetail() {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return <NotFound />;
  }

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Journal', path: '/journal' },
    { label: article.title },
  ];

  const related = articles
    .filter((item) => item.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) - Number(a.category === article.category),
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
      headline: article.title,
      description: article.excerpt,
      datePublished: article.dateISO,
      articleSection: article.category,
      author: { '@type': 'Organization', name: site.name, url: site.url },
      publisher: { '@type': 'Organization', name: site.name, url: site.url },
      image: absoluteUrl(article.image, site.url),
      mainEntityOfPage: `${site.url}/journal/${article.slug}`,
      isAccessibleForFree: true,
    },
  ];

  return (
    <PageTransition>
      <SEO
        title={article.title}
        description={article.excerpt}
        path={`/journal/${article.slug}`}
        image={article.image}
        type="article"
        jsonLd={jsonLd}
      />
      <ReadingProgress />

      <article className="bg-ivory pt-28 text-ink sm:pt-32">
        <Container>
          <Breadcrumbs items={breadcrumbs} tone="light" className="mb-12" />

          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">
              <span className="text-terracotta">{article.category}</span>
              <span className="size-1 bg-ink/20" aria-hidden="true" />
              <span>{article.date}</span>
              <span className="size-1 bg-ink/20" aria-hidden="true" />
              <span>{article.readTime} min read</span>
            </div>
            <h1 className="text-[clamp(2.6rem,6vw,5.8rem)] leading-[0.94]">{article.title}</h1>
            <p className="mt-6 max-w-2xl font-display text-xl leading-relaxed text-ink/60 sm:text-2xl">
              {article.excerpt}
            </p>
            <div className="mt-8 flex flex-col gap-6 border-t border-ink/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ink/45">
                Walking Shadow Poetry <span className="mx-2 text-terracotta">·</span> Nakuru, Kenya
              </p>
              <ShareLinks title={article.title} />
            </div>
          </div>

          <div className="mt-12 aspect-[16/9] overflow-hidden bg-ink/5">
            <ImageWithFallback
              src={article.image}
              alt={article.imageAlt}
              className="image-cover"
              width={1600}
              height={900}
              loading="eager"
            />
          </div>

          <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:gap-10">
            <aside className="lg:col-span-3">
              <div className="sticky top-28 space-y-8">
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Filed under</p>
                  <p className="text-sm text-ink/65">{article.category}</p>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Published</p>
                  <p className="text-sm text-ink/65">{article.date}</p>
                </div>
                <div>
                  <p className="eyebrow mb-3 text-terracotta">Reading time</p>
                  <p className="text-sm text-ink/65">{article.readTime} minutes</p>
                </div>
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-terracotta"
                >
                  <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                  All entries
                </Link>
              </div>
            </aside>

            <div className="lg:col-span-8 lg:col-start-5">
              <div className="max-w-3xl">
                {article.body.map((paragraph, index) => (
                  <p
                    key={index}
                    className={`mb-7 whitespace-pre-line font-display text-[1.25rem] leading-[1.8] text-ink/80 sm:text-[1.35rem] ${
                      index === 0
                        ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[0.75] first-letter:text-terracotta'
                        : ''
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="mt-14 border-t border-ink/15 pt-6 font-display text-2xl italic text-ink/55">
                  — Walking Shadow Poetry
                </p>
              </div>

              <div className="mt-14 border-t border-ink/15 pt-8">
                <ShareLinks title={article.title} />
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
                  More from the journal
                </h2>
              </div>
              <Link
                to="/journal"
                className="inline-flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/60 transition-colors hover:text-ivory"
              >
                All entries
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
            {related.map((item, index) => (
              <Reveal key={item.slug} delay={0.06 * index}>
                <Link to={`/journal/${item.slug}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-ivory/5">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.imageAlt}
                      className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                      width={800}
                      height={600}
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

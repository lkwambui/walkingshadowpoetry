import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../../data/articles';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function JournalPreview() {
  const [featured, ...rest] = articles;

  return (
    <section className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Journal"
            index="05"
            title={
              <>
                Notes from the <em className="text-terracotta">inner life.</em>
              </>
            }
            description="Essays, poems and reflections on love, identity, growth, faith and the business of being human."
            align="between"
            className="mb-14 border-b border-ink/15 pb-10 sm:mb-20"
          />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-7">
            <Link to={`/journal/${featured.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink/5">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.imageAlt}
                  className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  width={1600}
                  height={1067}
                />
                <span className="absolute left-5 top-5 bg-ivory px-3 py-2 text-[0.52rem] uppercase tracking-[0.2em] text-ink sm:left-6 sm:top-6">
                  {featured.category}
                </span>
              </div>
              <div className="mt-6">
                <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                  <span>{featured.date}</span>
                  <span className="size-1 bg-brand" aria-hidden="true" />
                  <span>{featured.readTime} min read</span>
                </p>
                <h3 className="max-w-2xl font-display text-[clamp(2.3rem,4.5vw,4rem)] leading-[0.98] transition-colors group-hover:text-terracotta">
                  {featured.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">
                  {featured.excerpt}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/50 transition-colors group-hover:text-terracotta">
                  Read article
                  <ArrowUpRight className="size-3" strokeWidth={1.5} />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="lg:col-span-5">
            {rest.slice(0, 3).map((article, index) => (
              <Reveal key={article.slug} delay={0.08 * (index + 1)}>
                <Link
                  to={`/journal/${article.slug}`}
                  className="group block border-t border-ink/15 py-6 first:border-t-0 first:pt-0"
                >
                  <p className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.52rem] uppercase tracking-[0.18em] text-ink/40">
                    <span className="text-terracotta">{article.category}</span>
                    <span className="size-1 bg-ink/20" aria-hidden="true" />
                    <span>{article.date}</span>
                    <span className="size-1 bg-ink/20" aria-hidden="true" />
                    <span>{article.readTime} min</span>
                  </p>
                  <div className="flex items-start justify-between gap-5">
                    <h3 className="max-w-sm font-display text-2xl leading-tight transition-colors group-hover:text-terracotta sm:text-[1.8rem]">
                      {article.title}
                    </h3>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 text-ink/30 transition-colors group-hover:text-terracotta" strokeWidth={1.4} />
                  </div>
                  <p className="mt-2 line-clamp-2 max-w-md text-xs leading-relaxed text-ink/55">
                    {article.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <Link
                to="/journal"
                className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.64rem] uppercase tracking-[0.22em] transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Read all writing
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

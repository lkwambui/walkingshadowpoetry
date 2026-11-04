import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { poems } from '../../data/poems';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

const featuredSlugs = ['relationships', 'emotions', 'breaks'];

export default function FeaturedPoetry() {
  const pieces = featuredSlugs
    .map((slug) => poems.find((poem) => poem.slug === slug))
    .filter((poem): poem is NonNullable<typeof poem> => Boolean(poem));
  const [featured, ...rest] = pieces;

  return (
    <section className="bg-ink py-24 text-ivory sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Poetry"
            index="01"
            tone="dark"
            title={
              <>
                The <em className="text-sand">Masterpieces</em>
              </>
            }
            description="Be able to impact lives and touch hearts in this generation through poetry and art."
            align="between"
            className="mb-14 border-b border-ivory/12 pb-10 sm:mb-20"
          />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          {featured && (
            <Reveal className="lg:col-span-7">
              <Link to={`/poetry/${featured.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory/5">
                  <ImageWithFallback
                    src={featured.image}
                    alt={featured.imageAlt}
                    className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.035]"
                    width={1400}
                    height={933}
                  />
                  <div className="absolute left-5 top-5 flex items-center gap-3 bg-ink/85 px-3 py-2 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/80 backdrop-blur-sm sm:left-7 sm:top-7">
                    <span className="size-1 bg-brand" aria-hidden="true" />
                    {featured.category}
                  </div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <div>
                    <p className="mb-2 text-[0.58rem] uppercase tracking-[0.22em] text-ivory/40">
                      Featured performance · {featured.date}
                    </p>
                    <h3 className="font-display text-[clamp(2.8rem,5vw,4.8rem)] leading-none text-ivory">
                      {featured.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/55">
                      {featured.excerpt}
                    </p>
                  </div>
                  <span className="mt-2 flex size-11 shrink-0 items-center justify-center border border-ivory/25 text-ivory transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                    <ArrowUpRight className="size-4" strokeWidth={1.4} />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="lg:col-span-5">
            {rest.map((piece, index) => (
              <Reveal key={piece.slug} delay={0.08 * (index + 1)}>
                <Link
                  to={`/poetry/${piece.slug}`}
                  className="group grid grid-cols-[7rem_1fr] gap-5 border-t border-ivory/12 py-7 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_1fr] sm:gap-7"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-ivory/5 sm:aspect-[4/5]">
                    <ImageWithFallback
                      src={piece.image}
                      alt={piece.imageAlt}
                      className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-105"
                      width={1400}
                      height={933}
                    />
                  </div>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <p className="mb-2 text-[0.55rem] uppercase tracking-[0.22em] text-sand">
                        {piece.category}
                      </p>
                      <h3 className="font-display text-3xl leading-none text-ivory transition-colors group-hover:text-sand sm:text-4xl">
                        {piece.title}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ivory/50">
                        {piece.excerpt}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-[0.56rem] uppercase tracking-[0.2em] text-ivory/45 transition-colors group-hover:text-ivory">
                      Read the piece
                      <ArrowUpRight className="size-3" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <Link
                to="/poetry"
                className="mt-8 inline-flex items-center gap-3 border-b border-ivory/40 pb-2 text-[0.64rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-brand-light hover:text-brand-light"
              >
                Explore all poetry
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

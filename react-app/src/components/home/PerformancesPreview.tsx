import { ArrowUpRight, MapPin, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pastPerformances } from '../../data/performances';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function PerformancesPreview() {
  const featured = pastPerformances.find((performance) => performance.featured) ?? pastPerformances[0];
  const others = pastPerformances.filter((performance) => performance.slug !== featured.slug);

  return (
    <section className="bg-brand-tint py-24 text-ink sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Performances"
            index="03"
            title={
              <>
                Words that <em className="text-brown">filled a room.</em>
              </>
            }
            description="A selection of documented performances from the Walking Shadow archive — staged, filmed and shared from Nakuru."
            align="between"
            className="mb-14 border-b border-ink/20 pb-10 sm:mb-20"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <article className="group">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink/10">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.imageAlt}
                  className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                  width={1800}
                  height={1200}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink px-5 py-4 text-ivory sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/70">
                    <span>{featured.date}</span>
                    <span className="hidden size-1 bg-brand sm:block" aria-hidden="true" />
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3" strokeWidth={1.5} />
                      {featured.location}
                    </span>
                  </div>
                  <Play className="size-4 fill-current text-ivory" strokeWidth={1.2} />
                </div>
              </div>

              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <p className="mb-2 text-[0.58rem] uppercase tracking-[0.2em] text-brown/60">
                    Featured performance
                  </p>
                  <h3 className="font-display text-[clamp(2.5rem,4.5vw,4.2rem)] leading-none">
                    {featured.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/65">
                    {featured.description}
                  </p>
                </div>
                {featured.youtubeId && (
                  <a
                    href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 hidden size-11 shrink-0 items-center justify-center border border-ink/25 transition-colors hover:bg-ink hover:text-ivory sm:flex"
                    aria-label={`Watch ${featured.title} on YouTube`}
                  >
                    <ArrowUpRight className="size-4" strokeWidth={1.4} />
                  </a>
                )}
              </div>
            </article>
          </Reveal>

          <div className="lg:col-span-5">
            {others.map((performance, index) => (
              <Reveal key={performance.slug} delay={0.08 * (index + 1)}>
                <article className="group border-t border-ink/20 py-7 first:border-t-0 first:pt-0">
                  <div className="grid grid-cols-[7.5rem_1fr] gap-5 sm:grid-cols-[10rem_1fr]">
                    <div className="aspect-[4/3] overflow-hidden bg-ink/10">
                      <ImageWithFallback
                        src={performance.image}
                        alt={performance.imageAlt}
                        className="image-cover transition-transform duration-700 group-hover:scale-105"
                        width={1800}
                        height={1200}
                      />
                    </div>
                    <div>
                      <p className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.55rem] uppercase tracking-[0.18em] text-ink/45">
                        <span>{performance.date}</span>
                        <span className="size-1 bg-brand" aria-hidden="true" />
                        <span>{performance.location}</span>
                      </p>
                      <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                        {performance.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ink/55">
                        {performance.description}
                      </p>
                      {performance.youtubeId ? (
                        <a
                          href={`https://www.youtube.com/watch?v=${performance.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-terracotta"
                        >
                          Watch performance
                          <ArrowUpRight className="size-3" strokeWidth={1.5} />
                        </a>
                      ) : (
                        <Link
                          to="/performances"
                          className="mt-3 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-terracotta"
                        >
                          View archive
                          <ArrowUpRight className="size-3" strokeWidth={1.5} />
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.28}>
              <Link
                to="/performances"
                className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.64rem] uppercase tracking-[0.22em] transition-colors hover:border-brown hover:text-brown"
              >
                View performances
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import VideoEmbed from '../components/common/VideoEmbed';
import { pastPerformances } from '../data/performances';
import { site } from '../data/site';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Performances' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

export default function Performances() {
  const featured = pastPerformances.find((performance) => performance.featured) ?? pastPerformances[0];
  const rest = pastPerformances.filter((performance) => performance.slug !== featured.slug);

  return (
    <PageTransition>
      <SEO
        title="Performances — Poetry in the room"
        description="Past Walking Shadow Poetry performances and live spoken-word moments from Nakuru, Kenya. Enquire about bookings, features and collaborations."
        path="/performances"
        image="/media/events/you-are-a-hero.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow="Live & in the room"
        title={
          <>
            The room, the voice, <em className="text-sand">the moment.</em>
          </>
        }
        intro="Spoken word belongs to the room it is spoken in. A record of past performances, and an open door for the next invitation."
        image="/media/events/you-are-a-hero.webp"
        imageAlt="Walking Shadow Poetry performing live in Nakuru"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-brand-tint/40 py-20 text-ink sm:py-24">
        <Container>
          <Reveal>
            <div className="grid gap-10 border border-ink/15 bg-ivory p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-14">
              <div className="lg:col-span-7">
                <p className="eyebrow text-terracotta">Upcoming performances</p>
                <h2 className="mt-4 max-w-2xl font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[0.98]">
                  No dates announced just yet.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/60">
                  Walking Shadow Poetry is not currently announcing upcoming performances. New dates
                  and appearances will be shared here and across our social channels when they are
                  confirmed.
                </p>
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <div className="border-t border-ink/15 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ink/40">
                    Planning an event?
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/60">
                    For bookings, features and collaborations, begin a conversation directly.
                  </p>
                  <div className="mt-6 flex flex-col items-start gap-3">
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-2 border-b border-ink pb-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      Make an enquiry
                      <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                    </Link>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-xs text-ink/50 transition-colors hover:text-terracotta"
                    >
                      {site.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 border-b border-ink/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-terracotta">The archive</p>
                <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">
                  Past performances
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-ink/50">
                A selection of documented performances from Nakuru and beyond.
              </p>
            </div>
          </Reveal>

          {featured && (
            <Reveal>
              <div className="mb-16 grid gap-8 border-b border-ink/15 pb-16 lg:grid-cols-12 lg:items-center lg:gap-12 lg:pb-20">
                <div className="lg:col-span-7">
                  {featured.youtubeId ? (
                    <div className="overflow-hidden bg-ink">
                      <VideoEmbed
                        videoId={featured.youtubeId}
                        title={featured.title}
                        poster={featured.image}
                        posterAlt={featured.imageAlt}
                        playLabel="Play featured performance"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] overflow-hidden bg-ink/5">
                      <ImageWithFallback
                        src={featured.image}
                        alt={featured.imageAlt}
                        className="image-cover"
                        width={1400}
                        height={1050}
                      />
                    </div>
                  )}
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="text-[0.58rem] uppercase tracking-[0.2em] text-terracotta">
                    Featured performance
                  </p>
                  <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[0.98]">
                    {featured.title}
                  </h3>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.55rem] uppercase tracking-[0.16em] text-ink/45">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3" strokeWidth={1.5} />
                      {featured.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3" strokeWidth={1.5} />
                      {featured.location}
                    </span>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-ink/60">{featured.description}</p>
                  {featured.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${featured.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-7 inline-flex items-center gap-2 border-b border-ink pb-1.5 text-[0.62rem] uppercase tracking-[0.2em] transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      Watch on YouTube
                      <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          <div className="grid gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-14 lg:grid-cols-3">
            {rest.map((performance, index) => {
              const href = performance.youtubeId
                ? `https://www.youtube.com/watch?v=${performance.youtubeId}`
                : performance.externalUrl;
              return (
                <Reveal key={performance.slug} delay={Math.min(index * 0.06, 0.2)}>
                  <article className="group flex h-full flex-col border-t border-ink/15 pt-5">
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                      <ImageWithFallback
                        src={performance.image}
                        alt={performance.imageAlt}
                        className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                        width={1200}
                        height={900}
                      />
                    </div>
                    <div className="mt-5 flex items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.16em] text-ink/40">
                      <span>{performance.date}</span>
                      <span className="size-1 bg-ink/20" aria-hidden="true" />
                      <span>{performance.location}</span>
                    </div>
                    <h3 className="mt-3 font-display text-[clamp(1.8rem,2.8vw,2.6rem)] leading-tight">
                      {performance.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/55">
                      {performance.description}
                    </p>
                    {href && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-terracotta"
                      >
                        {performance.youtubeId ? 'Watch the performance' : 'View the archive'}
                        <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                      </a>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

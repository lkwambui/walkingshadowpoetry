import { ArrowUpRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { episodes } from '../../data/episodes';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';
import VideoEmbed from '../common/VideoEmbed';

export default function FeaturedEpisodes() {
  const [featured, ...rest] = episodes;

  return (
    <section className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Episodes"
            index="02"
            title={
              <>
                Spoken word, <em className="text-terracotta">on film.</em>
              </>
            }
            description="Performance, faith, purpose and the questions we carry — a growing library of spoken-word episodes."
            align="between"
            className="mb-14 border-b border-ink/15 pb-10 sm:mb-20"
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <VideoEmbed
              videoId={featured.youtubeId}
              title={featured.title}
              poster={featured.thumbnail}
              posterAlt={featured.imageAlt}
            />
            <div className="mt-5 flex items-start justify-between gap-6">
              <div>
                <p className="mb-2 text-[0.58rem] uppercase tracking-[0.2em] text-terracotta">
                  Featured episode · {featured.category}
                </p>
                <h3 className="font-display text-4xl leading-none sm:text-5xl">
                  {featured.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">
                  {featured.description}
                </p>
              </div>
              <Link
                to="/episodes"
                className="mt-1 hidden size-11 shrink-0 items-center justify-center border border-ink/20 transition-colors hover:bg-ink hover:text-ivory sm:flex"
                aria-label="Browse all episodes"
              >
                <ArrowUpRight className="size-4" strokeWidth={1.4} />
              </Link>
            </div>
          </Reveal>

          <div className="lg:col-span-5">
            {rest.slice(0, 3).map((episode, index) => (
              <Reveal key={episode.slug} delay={0.08 * (index + 1)}>
                <Link
                  to="/episodes"
                  className="group flex items-center gap-5 border-t border-ink/15 py-6 first:border-t-0 first:pt-0"
                >
                  <div className="relative aspect-video w-28 shrink-0 overflow-hidden bg-ink/5 sm:w-36">
                    <ImageWithFallback
                      src={episode.thumbnail}
                      alt={episode.imageAlt}
                      className="image-cover transition-transform duration-700 group-hover:scale-105"
                      width={1280}
                      height={720}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-ink/25 text-ivory opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="size-5 fill-current" strokeWidth={1.2} />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="mb-1.5 text-[0.52rem] uppercase tracking-[0.2em] text-ink/40">
                      {episode.category}
                    </p>
                    <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-terracotta sm:text-[1.7rem]">
                      {episode.title}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
                      Watch episode
                      <ArrowUpRight className="size-3" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <Link
                to="/episodes"
                className="mt-8 inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.64rem] uppercase tracking-[0.22em] transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Browse the episode library
                <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

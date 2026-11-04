import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mission, site, values } from '../../data/site';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function BrandIntroduction() {
  return (
    <section id="introduction" className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <div className="mb-12 flex items-center justify-between border-b border-ink/15 pb-5">
            <span className="eyebrow text-terracotta">Our story</span>
            <span className="text-[0.6rem] uppercase tracking-[0.22em] text-ink/35">
              Since {site.founded}
            </span>
          </div>
        </Reveal>

        <Reveal>
          <SectionHeading
            title={
              <>
                We are a platform where words take you on a journey and give{' '}
                <em className="text-terracotta">resilience</em> a voice.
              </>
            }
            className="mb-16 max-w-6xl sm:mb-24"
          />
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                <ImageWithFallback
                  src="/media/about/about-story.webp"
                  alt="A creative portrait from the Walking Shadow Poetry archive"
                  className="image-cover"
                  width={2000}
                  height={1333}
                />
              </div>
              <div className="absolute -bottom-10 -right-2 hidden w-36 border-4 border-ivory sm:block lg:-right-8 lg:w-44">
                <div className="aspect-square overflow-hidden bg-ink/5">
                  <ImageWithFallback
                    src="/media/about/about-portrait.webp"
                    alt="A portrait from the Walking Shadow Poetry archive"
                    className="image-cover"
                    width={640}
                    height={640}
                  />
                </div>
              </div>
              <p className="mt-5 max-w-xs text-[0.6rem] uppercase tracking-[0.18em] text-ink/40">
                Words become performances. Performances become connection.
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.1}>
              <div className="space-y-6 text-[0.95rem] leading-[1.85] text-ink/70 sm:text-base">
                <p className="drop-cap text-ink/80">
                  Walking Shadow Poetry is a platform where words take you on a journey and give
                  resilience a voice. We started on 19 June 2021, and we are more than just poetry.
                  Our work shows the strength of the human spirit and its ability to rise above
                  challenges.
                </p>
                <p>
                  Our name comes from the biblical story of Peter, whose shadow carried healing
                  power and brought change wherever it fell. That image stays with us: even in the
                  darkest moments, there is room for growth and renewal.
                </p>
                <p>
                  We remind you of your ability to grow from what is meant to kill you, to acquire
                  confidence in expressing your feelings, and to find your own voice through poetry
                  and spoken word.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-ink/15 pt-8">
                {values.map((value, index) => (
                  <div key={value.title}>
                    <div className="mb-2 flex items-baseline gap-3">
                      <span className="text-[0.58rem] tracking-[0.2em] text-terracotta">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-2xl leading-none">{value.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-ink/55">{value.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.66rem] uppercase tracking-[0.2em] transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Read our story
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </Link>
                <p className="max-w-xs text-[0.68rem] uppercase tracking-[0.16em] text-ink/40">
                  {mission.aim}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

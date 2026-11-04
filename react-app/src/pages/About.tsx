import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingCTA from '../components/home/BookingCTA';
import Container from '../components/common/Container';
import ImageWithFallback from '../components/common/ImageWithFallback';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SectionHeading from '../components/common/SectionHeading';
import SEO from '../components/common/SEO';
import { aboutPrinciples, milestones, mission, site, values } from '../data/site';

const breadcrumbs = [
  { label: 'Home', path: '/' },
  { label: 'Our Story' },
];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

export default function About() {
  return (
    <PageTransition>
      <SEO
        title="Our Story"
        description="Walking Shadow Poetry began in Nakuru, Kenya on 19 June 2021. Discover the story, values and people behind a platform where words give resilience a voice."
        path="/about"
        image="/media/about/about-story.webp"
        jsonLd={breadcrumbLd}
      />

      <PageHero
        eyebrow={`Since ${site.founded} · Nakuru, Kenya`}
        title={
          <>
            Our <em className="text-sand">Story</em>
          </>
        }
        intro="A platform where words take you on a journey and give resilience a voice. We are more than poetry — we are a record of the strength of the human spirit."
        image="/media/about/about-story.webp"
        imageAlt="A creative portrait from the Walking Shadow Poetry archive"
        breadcrumbs={breadcrumbs}
        size="lg"
      />

      <section className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow text-terracotta">The beginning</p>
              <p className="mt-7 font-display text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.02]">
                We started on <em className="text-terracotta">19 June 2021</em> with a conviction
                that words can change a life.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="lg:col-span-7 lg:col-start-6">
              <div className="space-y-6 text-[0.95rem] leading-[1.9] text-ink/70 sm:text-base">
                <p className="drop-cap text-ink/80">
                  Walking Shadow Poetry is a platform where words take you on a journey and give
                  resilience a voice. We are more than just poetry. Our work shows the strength of
                  the human spirit and its ability to rise above challenges.
                </p>
                <p>
                  We remind you of your ability to grow from what is meant to kill you, acquire
                  confidence to express your feelings, and find your own voice through poetry and
                  spoken word. The work moves between the page and the stage: written to be read,
                  then performed to be felt.
                </p>
                <p>
                  Based in Nakuru, Kenya, Walking Shadow Poetry is a spoken refuge. It addresses
                  lives, offers a pathway to healing, growth and positive change, and makes room for
                  the stories that are too often kept quiet.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-ink py-24 text-ivory sm:py-32 lg:py-40">
        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-ivory/5">
                <ImageWithFallback
                  src="/media/about/about-expression.webp"
                  alt="A creative portrait from the Walking Shadow Poetry archive"
                  className="image-cover"
                  width={705}
                  height={797}
                />
              </div>
              <p className="mt-5 text-[0.58rem] uppercase tracking-[0.2em] text-ivory/35">
                The shadow is not the absence of light. It is evidence of it.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
              <p className="eyebrow mb-7 text-sand">Why “Walking Shadow”</p>
              <blockquote className="font-display text-[clamp(2.2rem,4.5vw,4.3rem)] leading-[0.98] text-ivory">
                “Even in the darkest moments, there is always room for growth and{' '}
                <em className="text-sand">renewal.</em>”
              </blockquote>
              <div className="mt-8 space-y-5 text-sm leading-[1.9] text-ivory/60 sm:text-base">
                <p>
                  Our name comes from the biblical story of Peter, a disciple of Jesus. In the
                  story, Peter&apos;s shadow carried healing power and brought change wherever it
                  fell.
                </p>
                <p>
                  This inspires us because it shows the hope and potential each of us has to make a
                  difference. Like Peter&apos;s shadow, Walking Shadow Poetry represents the power
                  to bring change.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How we work"
              title={
                <>
                  Poetry with a <em className="text-terracotta">purpose.</em>
                </>
              }
              description="Three commitments shape the way Walking Shadow Poetry moves through the world."
              align="between"
              className="mb-16 border-b border-ink/15 pb-10 sm:mb-24"
            />
          </Reveal>

          <div className="space-y-16 sm:space-y-24">
            {aboutPrinciples.map((principle, index) => (
              <Reveal key={principle.title}>
                <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
                  <div
                    className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2 lg:col-start-8' : ''}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-ink/5">
                      <ImageWithFallback
                        src={principle.image}
                        alt={principle.imageAlt}
                        className="image-cover"
                        width={1600}
                        height={1200}
                      />
                    </div>
                  </div>
                  <div
                    className={`lg:col-span-6 ${
                      index % 2 === 1 ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-7'
                    }`}
                  >
                    <span className="text-[0.6rem] tracking-[0.22em] text-terracotta">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-[clamp(2.3rem,4vw,4rem)] leading-none">
                      {principle.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-sm leading-[1.9] text-ink/65 sm:text-base">
                      {principle.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-tint py-24 text-ink sm:py-32 lg:py-40">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Core values"
              title={
                <>
                  What we <em className="text-brown">carry.</em>
                </>
              }
              description="Lending a voice to the voiceless."
              align="between"
              className="mb-14 border-b border-ink/20 pb-10 sm:mb-20"
            />
          </Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={0.05 * index}>
                <div className="border-t border-ink/20 pt-6">
                  <div className="flex items-baseline justify-between gap-6">
                    <h3 className="font-display text-4xl leading-none sm:text-5xl">
                      {value.title}
                    </h3>
                    <span className="text-[0.6rem] tracking-[0.22em] text-ink/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-24 text-ivory sm:py-32 lg:py-40">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Mission, vision & aim"
              tone="dark"
              title={
                <>
                  The work, <em className="text-sand">in words.</em>
                </>
              }
              align="between"
              className="mb-14 border-b border-ivory/12 pb-10 sm:mb-20"
            />
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
            {[
              { label: 'Mission', text: mission.mission },
              { label: 'Vision', text: mission.vision },
              { label: 'Aim', text: mission.aim },
            ].map((item, index) => (
              <Reveal key={item.label} delay={0.07 * index}>
                <div className="border-t border-ivory/20 pt-6">
                  <p className="eyebrow text-sand">{item.label}</p>
                  <p className="mt-6 font-display text-[clamp(1.8rem,2.8vw,2.8rem)] leading-[1.1] text-ivory">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.16}>
            <div className="mt-20 border-y border-ivory/12 py-14 text-center">
              <p className="font-display text-[clamp(2.4rem,6vw,6.5rem)] leading-[0.92] text-ivory">
                Grow from what&apos;s meant to <em className="text-sand">kill you.</em>
              </p>
              <p className="mt-5 text-[0.6rem] uppercase tracking-[0.26em] text-ivory/40">
                The Walking Shadow Poetry slogan
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-ivory py-24 text-ink sm:py-32 lg:py-40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-4">
              <p className="eyebrow text-terracotta">The journey</p>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,4.5vw,4.4rem)] leading-none">
                Selected <em className="text-terracotta">moments.</em>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink/55">
                A growing record of the places, performances and milestones that have shaped the
                work so far.
              </p>
            </Reveal>

            <div className="lg:col-span-7 lg:col-start-6">
              {milestones.map((milestone, index) => (
                <Reveal key={`${milestone.title}-${index}`} delay={0.04 * index}>
                  <div className="grid grid-cols-[3.5rem_1fr] gap-5 border-t border-ink/15 py-7 sm:grid-cols-[5rem_1fr] sm:gap-8">
                    <span className="font-display text-2xl italic text-terracotta sm:text-3xl">
                      {milestone.year}
                    </span>
                    <div>
                      <p className="mb-1 text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        {milestone.date}
                      </p>
                      <h3 className="font-display text-2xl leading-tight sm:text-3xl">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/55">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-tint py-24 text-ink sm:py-32">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-5">
              <div className="aspect-[4/5] overflow-hidden bg-ink/10">
                <ImageWithFallback
                  src="/media/about/about-portrait.webp"
                  alt="A portrait from the Walking Shadow Poetry archive"
                  className="image-cover"
                  width={640}
                  height={640}
                />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6 lg:col-start-7">
              <p className="eyebrow text-brown/60">The voice</p>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,4.5vw,4.4rem)] leading-none">
                Poetry by <em className="text-brown">Precious Owoko.</em>
              </h2>
              <div className="mt-6 space-y-5 text-sm leading-[1.9] text-ink/65 sm:text-base">
                <p>
                  Walking Shadow Poetry is the creative home of poet and spoken-word artist
                  Precious Owoko. The platform&apos;s performances and published pieces carry a
                  voice shaped by Nakuru, by lived experience, and by the belief that words can
                  help people grow.
                </p>
                <p>
                  For bookings, collaborations, press enquiries or the full published biography,
                  please get in touch directly.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 border-b border-ink pb-2 text-[0.64rem] uppercase tracking-[0.2em] transition-colors hover:border-brown hover:text-brown"
                >
                  Contact the studio
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </Link>
                <Link
                  to="/poetry"
                  className="text-[0.64rem] uppercase tracking-[0.2em] text-ink/55 transition-colors hover:text-brown"
                >
                  Read the poetry
                </Link>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <BookingCTA />
    </PageTransition>
  );
}

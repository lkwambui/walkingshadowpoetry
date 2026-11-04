import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { site } from '../../data/site';
import Button from '../common/Button';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';

export default function BookingCTA() {
  return (
    <section className="overflow-hidden bg-brown py-24 text-ivory sm:py-32 lg:py-36">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow mb-7 text-sand">Bookings & collaborations</p>
            <h2 className="max-w-3xl text-[clamp(2.7rem,6.4vw,6.6rem)] leading-[0.88] text-ivory">
              Let your next event have a <em className="text-sand">voice.</em>
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-relaxed text-ivory/65 sm:text-base">
              Walking Shadow Poetry brings poetry, spoken word and storytelling to stages,
              gatherings and creative collaborations. Based in Nakuru and open to conversations
              that begin with a word.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button to="/contact" variant="primary" size="lg">
                Book a performance
              </Button>
              <Button to="/contact" variant="outline-light" size="lg">
                Discuss a collaboration
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-ivory/15 pt-7 text-[0.6rem] uppercase tracking-[0.18em] text-ivory/55">
              <a
                href={site.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                <MessageCircle className="size-3.5 text-brand-light" strokeWidth={1.5} />
                WhatsApp us
              </a>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 transition-colors hover:text-ivory"
              >
                {site.email}
                <ArrowUpRight className="size-3" strokeWidth={1.5} />
              </a>
              <a href={site.phoneHref} className="transition-colors hover:text-ivory">
                {site.phone}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9">
            <div className="relative mx-auto max-w-sm">
              <div className="aspect-[4/5] overflow-hidden bg-ink/20">
                <ImageWithFallback
                  src="/media/gallery/artist-11.webp"
                  alt="A Walking Shadow Poetry performance portrait"
                  className="image-cover"
                  width={1600}
                  height={2400}
                />
              </div>
              <div className="absolute -bottom-5 -left-5 border border-ivory/20 bg-brown px-5 py-4 sm:-left-8">
                <p className="font-display text-2xl italic leading-none text-sand">Art from the Heart</p>
                <p className="mt-2 text-[0.55rem] uppercase tracking-[0.2em] text-ivory/45">
                  Nakuru, Kenya
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

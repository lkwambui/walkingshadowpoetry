import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { galleryPreview } from '../../data/gallery';
import Container from '../common/Container';
import ImageWithFallback from '../common/ImageWithFallback';
import Reveal from '../common/Reveal';
import SectionHeading from '../common/SectionHeading';

export default function GalleryPreview() {
  return (
    <section className="overflow-hidden bg-ink py-24 text-ivory sm:py-32 lg:py-40">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Gallery"
            index="04"
            tone="dark"
            title={
              <>
                Art from the <em className="text-sand">Heart.</em>
              </>
            }
            description="Exploring poetry, spoken word and artistic expression through the lens of Walking Shadow Poetry."
            align="between"
            className="mb-14 border-b border-ivory/12 pb-10 sm:mb-20"
          />
        </Reveal>

        <div className="columns-2 gap-4 lg:columns-3 lg:gap-5">
          {galleryPreview.map((item, index) => (
            <Reveal
              key={item.id}
              delay={0.05 * index}
              className="mb-4 break-inside-avoid lg:mb-5"
            >
              <Link to="/gallery" className="group block">
                <div
                  className="relative overflow-hidden bg-ivory/5"
                  style={{ aspectRatio: `${item.width} / ${item.height}` }}
                >
                  <ImageWithFallback
                    src={item.src}
                    alt={item.alt}
                    className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                    width={item.width}
                    height={item.height}
                  />
                  <div className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30" />
                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ivory/70">
                      {item.category}
                    </p>
                    <p className="mt-1 font-display text-xl leading-tight text-ivory">
                      {item.title}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-ivory/12 pt-7 sm:flex-row sm:items-center">
            <p className="max-w-md text-xs leading-relaxed text-ivory/45">
              A growing documentary archive of performances, awards, campaigns and the people who
              make the work possible.
            </p>
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-3 border-b border-ivory/40 pb-2 text-[0.64rem] uppercase tracking-[0.22em] text-ivory transition-colors hover:border-brand-light hover:text-brand-light"
            >
              View full gallery
              <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

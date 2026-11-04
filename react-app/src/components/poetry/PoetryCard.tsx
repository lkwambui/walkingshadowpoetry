import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Poem } from '../../data/poems';
import ImageWithFallback from '../common/ImageWithFallback';

interface PoetryCardProps {
  poem: Poem;
  index: number;
}

export default function PoetryCard({ poem, index }: PoetryCardProps) {
  return (
    <Link to={`/poetry/${poem.slug}`} className="group block border-t border-ink/15 py-8 sm:py-10">
      <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-8 lg:grid-cols-[12rem_1fr]">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
          <ImageWithFallback
            src={poem.image}
            alt={poem.imageAlt}
            className="image-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            width={1200}
            height={1500}
          />
          {poem.externalUrl && (
            <span className="absolute left-2 top-2 bg-ink/85 px-2 py-1 text-[0.48rem] uppercase tracking-[0.16em] text-ivory">
              Performance
            </span>
          )}
        </div>

        <div className="flex flex-col justify-between gap-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
              <span className="text-terracotta">{poem.category}</span>
              <span className="size-1 bg-ink/20" aria-hidden="true" />
              <span>{poem.date}</span>
              <span className="size-1 bg-ink/20" aria-hidden="true" />
              <span>{poem.readTime} min read</span>
              <span className="ml-auto hidden text-ink/25 sm:inline">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="max-w-2xl font-display text-[clamp(2rem,3.5vw,3.4rem)] leading-[1.02] transition-colors group-hover:text-terracotta">
              {poem.title}
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/55">{poem.excerpt}</p>
          </div>

          <span className="inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45 transition-colors group-hover:text-terracotta">
            {poem.externalUrl ? 'Read & watch the performance' : 'Read the poem'}
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}

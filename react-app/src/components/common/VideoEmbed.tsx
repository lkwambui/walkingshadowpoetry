import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '../../utils/format';
import ImageWithFallback from './ImageWithFallback';

interface VideoEmbedProps {
  videoId: string;
  title: string;
  poster?: string;
  posterAlt?: string;
  className?: string;
  aspectClassName?: string;
  playLabel?: string;
}

export default function VideoEmbed({
  videoId,
  title,
  poster,
  posterAlt,
  className,
  aspectClassName = 'aspect-video',
  playLabel = 'Play video',
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={cn('relative overflow-hidden bg-ink', aspectClassName, className)}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          className="group absolute inset-0 h-full w-full cursor-pointer"
          onClick={() => setPlaying(true)}
          aria-label={`${playLabel}: ${title}`}
        >
          {poster ? (
            <ImageWithFallback
              src={poster}
              alt={posterAlt ?? title}
              className="image-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
              width={1280}
              height={720}
            />
          ) : (
            <span className="absolute inset-0 bg-brown" />
          )}
          <span className="absolute inset-0 bg-ink/35 transition-colors duration-300 group-hover:bg-ink/25" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-ivory/60 bg-ink/25 text-ivory backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-brand group-hover:border-brand group-hover:text-ink sm:size-20">
            <Play className="ml-1 size-5 fill-current" strokeWidth={1.2} aria-hidden="true" />
          </span>
          <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-left sm:bottom-6 sm:left-6 sm:right-6">
            <span className="font-display text-xl leading-tight text-ivory sm:text-2xl">
              {title}
            </span>
            <span className="eyebrow hidden shrink-0 text-ivory/70 sm:block">Play episode</span>
          </span>
        </button>
      )}
    </div>
  );
}

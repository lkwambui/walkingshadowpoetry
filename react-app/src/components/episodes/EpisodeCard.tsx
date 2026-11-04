import { ArrowUpRight } from 'lucide-react';
import type { Episode } from '../../data/episodes';
import VideoEmbed from '../common/VideoEmbed';

interface EpisodeCardProps {
  episode: Episode;
  index: number;
}

export default function EpisodeCard({ episode, index }: EpisodeCardProps) {
  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-ink">
        <VideoEmbed
          videoId={episode.youtubeId}
          title={episode.title}
          poster={episode.thumbnail}
          posterAlt={episode.imageAlt}
          playLabel={`Play episode ${index + 1}`}
        />
      </div>
      <div className="flex flex-1 flex-col border-t border-ink/15 pt-5">
        <div className="mb-2 flex items-center justify-between gap-4 text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
          <span className="text-terracotta">{episode.category}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.3rem)] leading-tight">
          {episode.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/55">{episode.description}</p>
        <a
          href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-terracotta"
        >
          Watch on YouTube
          <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
        </a>
      </div>
    </article>
  );
}

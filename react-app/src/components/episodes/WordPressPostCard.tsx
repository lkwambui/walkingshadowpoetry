import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getFeaturedImage,
  getPostCategories,
  getPostExcerpt,
  getPostTitle,
  type WPPost,
} from '../../services/wordpress';
import ImageWithFallback from '../common/ImageWithFallback';

interface WordPressPostCardProps {
  post: WPPost;
}

export default function WordPressPostCard({ post }: WordPressPostCardProps) {
  const image = getFeaturedImage(post);
  const category = getPostCategories(post)[0]?.name;
  const title = getPostTitle(post);

  return (
    <article className="group flex h-full flex-col">
      <Link to={`/episodes/${post.slug}`} className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-ink/5">
          {image ? (
            <ImageWithFallback
              src={image.url}
              alt={image.alt}
              className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
              width={image.width ?? 800}
              height={image.height ?? 600}
            />
          ) : (
            <div className="flex h-full items-end bg-brown p-6 text-ivory/70">
              <span className="font-display text-3xl italic">Walking Shadow</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col border-t border-ink/15 pt-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
            {category && <span className="text-terracotta">{category}</span>}
            <span>{formatDate(post.date)}</span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.05] transition-colors group-hover:text-terracotta">
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-ink/55">
            {getPostExcerpt(post)}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45 transition-colors group-hover:text-terracotta">
            Read more
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </article>
  );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-KE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

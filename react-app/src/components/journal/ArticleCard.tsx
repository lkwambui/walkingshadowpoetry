import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Article } from '../../data/articles';
import ImageWithFallback from '../common/ImageWithFallback';

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <Link to={`/journal/${article.slug}`} className="flex h-full flex-col">
        <div className="aspect-[4/3] overflow-hidden bg-ink/5">
          <ImageWithFallback
            src={article.image}
            alt={article.imageAlt}
            className="image-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
            width={1200}
            height={900}
          />
        </div>
        <div className="flex flex-1 flex-col border-t border-ink/15 pt-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
            <span className="text-terracotta">{article.category}</span>
            <span className="size-1 bg-ink/20" aria-hidden="true" />
            <span>{article.date}</span>
            <span className="size-1 bg-ink/20" aria-hidden="true" />
            <span>{article.readTime} min</span>
          </div>
          <h3 className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] leading-[1.05] transition-colors group-hover:text-terracotta">
            {article.title}
          </h3>
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-ink/55">
            {article.excerpt}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-ink/45 transition-colors group-hover:text-terracotta">
            Read the journal
            <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </article>
  );
}

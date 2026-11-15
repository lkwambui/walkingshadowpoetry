import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../utils/format';
import { shopCategories } from '../../data/shop';
import ImageWithFallback from '../common/ImageWithFallback';

interface CategoryGridProps {
  className?: string;
  limit?: number;
}

export default function CategoryGrid({ className, limit }: CategoryGridProps) {
  const categories = limit ? shopCategories.slice(0, limit) : shopCategories;

  return (
    <div className={cn('grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {categories.map((category, index) => (
        <Link
          key={category.slug}
          to={category.href}
          className="group flex flex-col"
          style={{ transitionDelay: `${index * 30}ms` }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
            <ImageWithFallback
              src={category.image}
              alt={`${category.name} — Walking Shadow Poetry`}
              className="image-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              width={800}
              height={1000}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-ivory">
              <div>
                <p className="text-[0.5rem] uppercase tracking-[0.24em] text-ivory/70">
                  {category.tagline}
                </p>
                <h3 className="mt-1 font-display text-2xl leading-none">{category.name}</h3>
              </div>
              <ArrowUpRight
                className="size-5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.4}
              />
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-ink/55">{category.description}</p>
        </Link>
      ))}
    </div>
  );
}

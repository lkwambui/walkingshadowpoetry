import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  tone?: 'light' | 'dark';
  className?: string;
}

export default function Breadcrumbs({ items, tone = 'dark', className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol
        className={cn(
          'flex flex-wrap items-center gap-2 text-[0.6rem] uppercase tracking-[0.22em]',
          tone === 'dark' ? 'text-ivory/60' : 'text-ink/55',
        )}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li>
                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className={cn(
                      'transition-colors',
                      tone === 'dark' ? 'hover:text-ivory' : 'hover:text-ink',
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <ChevronRight className="size-3" strokeWidth={1.5} />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

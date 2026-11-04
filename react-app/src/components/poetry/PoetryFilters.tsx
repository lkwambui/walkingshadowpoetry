import { Search, X } from 'lucide-react';
import { cn } from '../../utils/format';

interface PoetryFiltersProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  count: number;
}

export default function PoetryFilters({
  categories,
  activeCategory,
  onCategoryChange,
  search,
  onSearchChange,
  count,
}: PoetryFiltersProps) {
  return (
    <div className="border-y border-ink/15 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" role="group" aria-label="Filter poetry by category">
          {['All', ...categories].map((category) => {
            const active = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                aria-pressed={active}
                className={cn(
                  'shrink-0 border px-4 py-2.5 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
                  active
                    ? 'border-ink bg-ink text-ivory'
                    : 'border-ink/15 text-ink/60 hover:border-ink/40 hover:text-ink',
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <label className="relative flex w-full items-center sm:w-64">
            <span className="sr-only">Search poems</span>
            <Search className="pointer-events-none absolute left-0 size-4 text-ink/35" strokeWidth={1.5} />
            <input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search poems"
              className="w-full border-b border-ink/25 bg-transparent py-2 pl-7 pr-7 text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-0 text-ink/40 transition-colors hover:text-ink"
                aria-label="Clear search"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            )}
          </label>
          <span className="shrink-0 text-[0.55rem] uppercase tracking-[0.18em] text-ink/40">
            {count} {count === 1 ? 'piece' : 'pieces'}
          </span>
        </div>
      </div>
    </div>
  );
}

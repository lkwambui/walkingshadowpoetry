import { useState } from 'react';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '../../utils/format';
import { priceBands, sortOptions } from '../../data/shop';
import type { StoreTerm } from '../../services/storeApi';

export interface ShopFilters {
  search: string;
  category: string;
  price: string;
  size: string;
  colour: string;
  sort: string;
}

export const defaultFilters: ShopFilters = {
  search: '',
  category: '',
  price: '',
  size: '',
  colour: '',
  sort: 'date-desc',
};

interface FilterBarProps {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  categories?: StoreTerm[];
  sizes?: { id: number; name: string; slug: string }[];
  colours?: { id: number; name: string; slug: string }[];
  resultCount?: number;
  hideCategory?: boolean;
}

const selectClass =
  'w-full appearance-none border border-ink/20 bg-ivory px-4 py-3 pr-9 text-xs uppercase tracking-[0.14em] text-ink/70 focus:border-ink focus:outline-none';

export default function FilterBar({
  filters,
  onChange,
  categories = [],
  sizes = [],
  colours = [],
  resultCount,
  hideCategory = false,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);

  const update = (patch: Partial<ShopFilters>) => onChange({ ...filters, ...patch });
  const activeCount = [filters.search, filters.category, filters.price, filters.size, filters.colour].filter(Boolean)
    .length;

  const reset = () => onChange({ ...defaultFilters, category: hideCategory ? '' : filters.category });

  const activeChips = [
    filters.search && {
      key: 'search',
      label: `Search: ${filters.search}`,
      clear: () => update({ search: '' }),
    },
    filters.category && {
      key: 'category',
      label: `Category: ${categories.find((category) => category.slug === filters.category)?.name ?? filters.category}`,
      clear: () => update({ category: '' }),
    },
    filters.price && {
      key: 'price',
      label: priceBands.find((band) => band.value === filters.price)?.label ?? filters.price,
      clear: () => update({ price: '' }),
    },
    filters.size && {
      key: 'size',
      label: `Size: ${sizes.find((size) => size.slug === filters.size)?.name ?? filters.size}`,
      clear: () => update({ size: '' }),
    },
    filters.colour && {
      key: 'colour',
      label: `Colour: ${colours.find((colour) => colour.slug === filters.colour)?.name ?? filters.colour}`,
      clear: () => update({ colour: '' }),
    },
  ].filter((chip): chip is { key: string; label: string; clear: () => void } => Boolean(chip));

  const controls = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {!hideCategory && (
        <label className="relative block">
          <span className="mb-1.5 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
            Category
          </span>
          <select
            value={filters.category}
            onChange={(event) => update({ category: event.target.value })}
            className={selectClass}
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-ink/40" strokeWidth={1.5} />
        </label>
      )}

      <label className="relative block">
        <span className="mb-1.5 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
          Price
        </span>
        <select
          value={filters.price}
          onChange={(event) => update({ price: event.target.value })}
          className={selectClass}
        >
          {priceBands.map((band) => (
            <option key={band.label} value={band.value}>
              {band.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-ink/40" strokeWidth={1.5} />
      </label>

      {sizes.length > 0 && (
        <label className="relative block">
          <span className="mb-1.5 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
            Size
          </span>
          <select
            value={filters.size}
            onChange={(event) => update({ size: event.target.value })}
            className={selectClass}
          >
            <option value="">All sizes</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.slug}>
                {size.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-ink/40" strokeWidth={1.5} />
        </label>
      )}

      {colours.length > 0 && (
        <label className="relative block">
          <span className="mb-1.5 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
            Colour
          </span>
          <select
            value={filters.colour}
            onChange={(event) => update({ colour: event.target.value })}
            className={selectClass}
          >
            <option value="">All colours</option>
            {colours.map((colour) => (
              <option key={colour.id} value={colour.slug}>
                {colour.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-3.5 right-3 size-4 text-ink/40" strokeWidth={1.5} />
        </label>
      )}
    </div>
  );

  return (
    <div className="border-y border-ink/15 py-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
          <input
            type="search"
            value={filters.search}
            onChange={(event) => update({ search: event.target.value })}
            placeholder="Search the collection"
            aria-label="Search products"
            className="w-full border border-ink/20 bg-ivory py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center gap-2 border border-ink/20 px-4 py-3 text-[0.58rem] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:border-ink hover:text-ink lg:hidden"
              aria-expanded={open}
            >
              <SlidersHorizontal className="size-3.5" strokeWidth={1.6} />
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 text-[0.58rem] uppercase tracking-[0.18em] text-terracotta transition-colors hover:text-brand-deep"
              >
                <X className="size-3.5" strokeWidth={1.6} />
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {typeof resultCount === 'number' && (
              <span className="text-[0.58rem] uppercase tracking-[0.18em] text-ink/40">
                {resultCount} {resultCount === 1 ? 'piece' : 'pieces'}
              </span>
            )}
            <label className="relative block">
              <span className="sr-only">Sort products</span>
              <select
                value={filters.sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="appearance-none border border-ink/20 bg-ivory py-3 pl-4 pr-9 text-[0.58rem] uppercase tracking-[0.18em] text-ink/70 focus:border-ink focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" strokeWidth={1.5} />
            </label>
          </div>
        </div>
      </div>

      <div className={cn('lg:block', open ? 'mt-6 block' : 'hidden')}>{controls}</div>

      {activeChips.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Active filters">
          {activeChips.map((chip) => (
            <li key={chip.key}>
              <button
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-2 border border-ink/15 bg-ivory px-3 py-2 text-[0.55rem] uppercase tracking-[0.14em] text-ink/60 transition-colors hover:border-terracotta hover:text-terracotta"
              >
                {chip.label}
                <X className="size-3" strokeWidth={1.8} aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

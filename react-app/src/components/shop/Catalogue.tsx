import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../common/Button';
import FilterBar from './FilterBar';
import type { ShopFilters } from './FilterBar';
import { defaultFilters } from './FilterBar';
import ProductGrid from './ProductGrid';
import ShopEmptyState from './ShopEmptyState';
import { useCategories, useProductCollection } from '../../hooks/useShopData';
import { colourAttribute, sizeAttribute } from '../../services/productUtils';
import type { ProductQuery, StoreProduct } from '../../services/storeApi';

interface CatalogueProps {
  category?: string;
  columns?: 2 | 3 | 4;
  emptyTitle?: string;
  emptyDescription?: string;
}

function parseSort(sort: string): Pick<ProductQuery, 'orderby' | 'order'> {
  const [orderby, order] = sort.split('-');
  return {
    orderby: (orderby || 'date') as ProductQuery['orderby'],
    order: (order as 'asc' | 'desc') || 'desc',
  };
}

export default function Catalogue({
  category,
  columns = 4,
  emptyTitle = 'Nothing matches these filters yet.',
  emptyDescription = 'Try a different category, price range or search — or clear the filters to see the full collection.',
}: CatalogueProps) {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';
  const [filters, setFilters] = useState<ShopFilters>({
    ...defaultFilters,
    search: urlSearch,
    category: category ?? '',
  });

  useEffect(() => {
    setFilters((current) => ({ ...current, search: urlSearch }));
  }, [urlSearch]);

  const { orderby, order } = parseSort(filters.sort);
  const [minPrice, maxPrice] = filters.price ? filters.price.split('-') : ['', ''];
  const query: ProductQuery = {
    search: filters.search || undefined,
    category: category || filters.category || undefined,
    minPrice: minPrice ? String(Number(minPrice) * 100) : undefined,
    maxPrice: maxPrice ? String(Number(maxPrice) * 100) : undefined,
    orderby,
    order,
    perPage: 100,
  };

  const collection = useProductCollection(query);
  const { data: categories } = useCategories();
  const allProducts = collection.data?.items ?? [];

  const products = useMemo(
    () =>
      allProducts.filter((product: StoreProduct) => {
        if (filters.size && !sizeAttribute(product)?.terms.some((term) => term.slug === filters.size)) {
          return false;
        }
        if (
          filters.colour &&
          !colourAttribute(product)?.terms.some((term) => term.slug === filters.colour)
        ) {
          return false;
        }
        return true;
      }),
    [allProducts, filters.size, filters.colour],
  );

  const sizes = useMemo(() => {
    const map = new Map<string, { id: number; name: string; slug: string }>();
    allProducts.forEach((product) => sizeAttribute(product)?.terms.forEach((term) => map.set(term.slug, term)));
    return Array.from(map.values());
  }, [allProducts]);

  const colours = useMemo(() => {
    const map = new Map<string, { id: number; name: string; slug: string }>();
    allProducts.forEach((product) => colourAttribute(product)?.terms.forEach((term) => map.set(term.slug, term)));
    return Array.from(map.values());
  }, [allProducts]);

  const resultCount = filters.size || filters.colour ? products.length : (collection.data?.total ?? products.length);
  const reset = () => setFilters({ ...defaultFilters, category: category ?? '' });

  return (
    <div>
      <FilterBar
        filters={filters}
        onChange={setFilters}
        categories={categories}
        sizes={sizes}
        colours={colours}
        resultCount={collection.isLoading ? undefined : resultCount}
        hideCategory={Boolean(category)}
      />

      <div className="mt-14">
        {collection.isLoading ? (
          <ProductGrid products={[]} loading skeletonCount={8} columns={columns} />
        ) : collection.isError ? (
          <ShopEmptyState
            eyebrow="Connection issue"
            title="We could not reach the shop just now."
            description="The WooCommerce catalogue is temporarily unavailable. Please refresh the page or try again shortly."
            action={
              <Button variant="dark" onClick={() => collection.refetch()}>
                Retry
              </Button>
            }
          />
        ) : products.length === 0 ? (
          <ShopEmptyState
            eyebrow="No matches"
            title={emptyTitle}
            description={emptyDescription}
            action={
              <Button variant="dark" onClick={reset}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <ProductGrid products={products} columns={columns} />
        )}
      </div>
    </div>
  );
}

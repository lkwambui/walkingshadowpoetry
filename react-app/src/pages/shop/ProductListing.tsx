import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import FilterBar from '../../components/shop/FilterBar';
import type { ShopFilters } from '../../components/shop/FilterBar';
import { defaultFilters } from '../../components/shop/FilterBar';
import ProductGrid from '../../components/shop/ProductGrid';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { useCategories, useProducts } from '../../hooks/useShopData';
import { colourAttribute, sizeAttribute } from '../../services/productUtils';
import type { StoreProduct } from '../../services/storeApi';
import { site } from '../../data/site';

interface ProductListingProps {
  eyebrow: string;
  title: string;
  description: string;
  /** Comma-separated WooCommerce category slugs to filter by. */
  category?: string;
  /** Canonical path for SEO when it differs from the filter slugs. */
  canonicalPath?: string;
  image?: string;
  breadcrumbLabel: string;
}

function parseSort(sort: string): { orderby: string; order: 'asc' | 'desc' } {
  const [orderby, order] = sort.split('-');
  return { orderby: orderby || 'date', order: (order as 'asc' | 'desc') || 'desc' };
}

function filterByAttribute(
  products: StoreProduct[],
  size: string,
  colour: string,
): StoreProduct[] {
  return products.filter((product) => {
    if (size) {
      const attribute = sizeAttribute(product);
      if (!attribute?.terms.some((term) => term.slug === size)) return false;
    }
    if (colour) {
      const attribute = colourAttribute(product);
      if (!attribute?.terms.some((term) => term.slug === colour)) return false;
    }
    return true;
  });
}

export default function ProductListing({
  eyebrow,
  title,
  description,
  category,
  canonicalPath,
  image = '/media/shop/shop-poster.webp',
  breadcrumbLabel,
}: ProductListingProps) {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') ?? '';

  const [filters, setFilters] = useState<ShopFilters>({
    ...defaultFilters,
    search: urlSearch,
    category: category ?? '',
  });

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      search: urlSearch,
      category: category ?? current.category,
    }));
  }, [urlSearch, category]);

  const { orderby, order } = parseSort(filters.sort);
  const [minPrice, maxPrice] = filters.price ? filters.price.split('-') : ['', ''];

  const query = {
    search: filters.search,
    category: category || filters.category || undefined,
    minPrice: minPrice ? String(Number(minPrice) * 100) : undefined,
    maxPrice: maxPrice ? String(Number(maxPrice) * 100) : undefined,
    orderby,
    order,
    perPage: 100,
  };

  const { data, isLoading, isError } = useProducts(query as never);
  const { data: categories } = useCategories();

  const products = useMemo(
    () => filterByAttribute(data ?? [], filters.size, filters.colour),
    [data, filters.size, filters.colour],
  );

  const sizes = useMemo(() => {
    const map = new Map<string, { id: number; name: string; slug: string }>();
    (data ?? []).forEach((product) => {
      sizeAttribute(product)?.terms.forEach((term) => map.set(term.slug, term));
    });
    return Array.from(map.values());
  }, [data]);

  const colours = useMemo(() => {
    const map = new Map<string, { id: number; name: string; slug: string }>();
    (data ?? []).forEach((product) => {
      colourAttribute(product)?.terms.forEach((term) => map.set(term.slug, term));
    });
    return Array.from(map.values());
  }, [data]);

  return (
    <PageTransition>
      <SEO
        title={`${title} — Shop`}
        description={description}
        path={canonicalPath ?? (category ? `/shop/categories/${category}` : '/shop/clothing')}
        image={image}
        jsonLd={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
            { '@type': 'ListItem', position: 3, name: breadcrumbLabel },
          ],
        }}
      />

      <ShopSubnav />

      <section className="bg-ivory pb-10 pt-14 text-ink sm:pt-16">
        <Container>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: breadcrumbLabel },
            ]}
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-terracotta">{eyebrow}</p>
              <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.94]">
                {title}
              </h1>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink/60 lg:col-span-4 lg:col-start-9">
              {description}
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-ivory pb-24 text-ink">
        <Container>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            categories={categories}
            sizes={sizes}
            colours={colours}
            resultCount={isLoading ? undefined : products.length}
            hideCategory={Boolean(category)}
          />

          <div className="mt-14">
            {isLoading ? (
              <ProductGrid products={[]} loading skeletonCount={8} />
            ) : isError ? (
              <ShopEmptyState
                eyebrow="Connection issue"
                title="We could not reach the shop just now."
                description="The WooCommerce catalogue is temporarily unavailable. Please refresh the page or try again shortly."
                action={
                  <Button variant="dark" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                }
              />
            ) : products.length === 0 ? (
              <ShopEmptyState
                eyebrow="No matches"
                title="Nothing matches these filters yet."
                description="Try a different category, size, colour or price range — or clear the filters to see the full collection."
                action={
                  <Button
                    variant="dark"
                    onClick={() => setFilters({ ...defaultFilters, category: category ?? '' })}
                  >
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <ProductGrid products={products} columns={4} />
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

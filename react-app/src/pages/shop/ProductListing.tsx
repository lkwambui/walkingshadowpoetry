import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Catalogue from '../../components/shop/Catalogue';
import ShopSubnav from '../../components/shop/ShopSubnav';
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

export default function ProductListing({
  eyebrow,
  title,
  description,
  category,
  canonicalPath,
  image = '/media/shop/shop-poster.webp',
  breadcrumbLabel,
}: ProductListingProps) {
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
          <Catalogue category={category} />
        </Container>
      </section>
    </PageTransition>
  );
}

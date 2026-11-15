import { useParams } from 'react-router-dom';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { getPolicy } from '../../data/policies';
import { site } from '../../data/site';

export default function Policy() {
  const { slug = '' } = useParams();
  const policy = getPolicy(slug);

  if (!policy) {
    return (
      <PageTransition>
        <ShopSubnav />
        <Container className="py-24">
          <ShopEmptyState
            eyebrow="Not found"
            title="We could not find that page."
            description="The page you are looking for may have moved."
            action={
              <Button to="/shop" variant="dark">
                Back to the shop
              </Button>
            }
          />
        </Container>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <SEO
        title={policy.title}
        description={policy.intro.slice(0, 155)}
        path={`/shop/policies/${policy.slug}`}
        jsonLd={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
            { '@type': 'ListItem', position: 3, name: policy.title },
          ],
        }}
      />

      <ShopSubnav />

      <section className="bg-ivory py-12 text-ink sm:py-16">
        <Container>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: policy.title },
            ]}
          />

          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-terracotta">Walking Shadow Shop</p>
              <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.0]">
                {policy.title}
              </h1>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-base leading-relaxed text-ink/70">{policy.intro}</p>

              <div className="mt-12 space-y-12">
                {policy.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-2xl">{section.heading}</h2>
                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink/65">
                      {section.body.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-14 border-t border-ink/15 pt-8">
                <p className="text-sm text-ink/55">
                  Questions about this policy?{' '}
                  <a
                    href={`mailto:${site.email}`}
                    className="underline decoration-terracotta underline-offset-4"
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

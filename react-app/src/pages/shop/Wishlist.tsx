import { useMemo } from 'react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import ProductGrid from '../../components/shop/ProductGrid';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import ShopSubnav from '../../components/shop/ShopSubnav';
import { useProductCollection } from '../../hooks/useShopData';
import { useWishlist } from '../../hooks/useWishlist';

export default function Wishlist() {
  const wishlist = useWishlist();
  const collection = useProductCollection({ perPage: 100 });

  const products = useMemo(() => {
    const byId = new Map((collection.data?.items ?? []).map((product) => [product.id, product]));
    return wishlist.ids
      .map((id) => byId.get(id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));
  }, [collection.data?.items, wishlist.ids]);

  return (
    <PageTransition>
      <SEO
        title="Your wishlist"
        description="Pieces you saved from the Walking Shadow Poetry shop."
        path="/shop/wishlist"
        noindex
      />

      <ShopSubnav />

      <section className="bg-ivory py-12 text-ink sm:py-16">
        <Container>
          <Breadcrumbs
            tone="light"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Wishlist' },
            ]}
          />

          <div className="mt-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-terracotta">Saved for later</p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.0]">
                Wishlist
              </h1>
            </div>
            {wishlist.count > 0 && (
              <div className="flex items-center gap-5">
                <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink/45">
                  {wishlist.count} {wishlist.count === 1 ? 'piece' : 'pieces'}
                </p>
                <button
                  type="button"
                  onClick={wishlist.clear}
                  className="text-[0.58rem] uppercase tracking-[0.18em] text-terracotta transition-colors hover:text-brand-deep"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="mt-14">
            {collection.isLoading ? (
              <ProductGrid products={[]} loading skeletonCount={4} />
            ) : products.length === 0 ? (
              <ShopEmptyState
                eyebrow="Nothing saved yet"
                title="Keep the pieces you love close."
                description="Tap the heart on any product to save it here while you decide. Your wishlist stays on this device."
                action={
                  <Button to="/shop/clothing" variant="dark">
                    Explore the collection
                  </Button>
                }
              />
            ) : (
              <>
                <ProductGrid products={products} columns={4} />
                <div className="mt-16 flex justify-center">
                  <Button to="/shop/clothing" variant="outline">
                    Continue exploring
                  </Button>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

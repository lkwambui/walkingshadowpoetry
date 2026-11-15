import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import CartLineItem from '../../components/shop/CartLineItem';
import CartSummary from '../../components/shop/CartSummary';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { useCart } from '../../hooks/useCart';
import { site } from '../../data/site';

export default function Cart() {
  const { cart, items, itemCount, isLoading, isMutating, error, updateItem, removeItem } = useCart();

  return (
    <PageTransition>
      <SEO
        title="Your cart"
        description="Review the pieces in your Walking Shadow Poetry cart before checkout."
        path="/shop/cart"
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
              { label: 'Cart' },
            ]}
          />

          <div className="mt-10 flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-terracotta">Your selection</p>
              <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.0]">
                Cart
              </h1>
            </div>
            {itemCount > 0 && (
              <p className="text-[0.6rem] uppercase tracking-[0.2em] text-ink/45">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>

          {isLoading ? (
            <div className="mt-14 space-y-6">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex gap-6 border-b border-ink/15 py-6">
                  <div className="aspect-[4/5] w-24 animate-pulse bg-ink/5" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-1/2 animate-pulse bg-ink/10" />
                    <div className="h-3 w-1/4 animate-pulse bg-ink/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mt-14">
              <ShopEmptyState
                eyebrow="Connection issue"
                title="We could not load your cart."
                description="The WooCommerce cart is temporarily unavailable. Please refresh the page."
                action={
                  <Button variant="dark" onClick={() => window.location.reload()}>
                    Refresh
                  </Button>
                }
              />
            </div>
          ) : items.length === 0 ? (
            <div className="mt-14">
              <ShopEmptyState
                eyebrow="Empty cart"
                title="Your cart is waiting to be filled."
                description="Explore poetry-inspired clothing, or commission a personalized note or poem written for someone you love."
                action={
                  <div className="flex flex-wrap gap-4">
                    <Button to="/shop/clothing" variant="dark">
                      Explore the collection
                    </Button>
                    <Button to="/shop/personalized" variant="outline">
                      Create something personal
                    </Button>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-7">
                <div className="border-t border-ink/15">
                  {items.map((item) => (
                    <CartLineItem
                      key={item.key}
                      item={item}
                      onUpdate={updateItem}
                      onRemove={removeItem}
                      busy={isMutating}
                    />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Link
                    to="/shop/clothing"
                    className="inline-flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.2em] text-ink/55 transition-colors hover:text-terracotta"
                  >
                    <ShoppingBag className="size-3.5" strokeWidth={1.6} />
                    Continue shopping
                  </Link>
                  <Link
                    to="/shop/personalized"
                    className="hidden items-center gap-2 text-[0.6rem] uppercase tracking-[0.2em] text-ink/55 transition-colors hover:text-terracotta sm:inline-flex"
                  >
                    Add a personalized piece
                    <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 lg:col-start-9">
                <div className="lg:sticky lg:top-40">
                  {cart && (
                    <CartSummary cart={cart}>
                      <Button to="/shop/checkout" variant="dark" size="lg" className="w-full">
                        Proceed to checkout
                      </Button>
                      <p className="mt-4 text-center text-[0.58rem] uppercase tracking-[0.16em] text-ink/35">
                        Secure checkout · M-Pesa
                      </p>
                    </CartSummary>
                  )}

                  <div className="mt-6 border border-ink/15 p-6">
                    <p className="eyebrow text-terracotta">Need help?</p>
                    <p className="mt-3 text-xs leading-relaxed text-ink/55">
                      Questions about sizing, delivery or a personalized piece?{' '}
                      <a
                        href={site.social.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-terracotta underline-offset-4"
                      >
                        Message us on WhatsApp
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </PageTransition>
  );
}

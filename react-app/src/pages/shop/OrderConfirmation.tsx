import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Package, XCircle } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Button from '../../components/common/Button';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { fetchOrder, formatMinor, type StoreOrder } from '../../services/storeApi';
import { isMockMode } from '../../services/storeApi';
import { mockGetOrder } from '../../services/mock/mockCart';

function statusCopy(order: StoreOrder) {
  const paid = order.status === 'processing' || order.status === 'completed';
  const failed = order.status === 'failed' || order.status === 'cancelled';
  if (paid) {
    return {
      icon: CheckCircle2,
      tone: 'text-green-deep',
      title: 'Payment received',
      body: 'Thank you. Your order is confirmed and is being prepared.',
    };
  }
  if (failed) {
    return {
      icon: XCircle,
      tone: 'text-terracotta',
      title: 'Payment not completed',
      body: 'This order was not paid. If you were charged, contact us and we will resolve it.',
    };
  }
  return {
    icon: Clock,
    tone: 'text-terracotta',
    title: 'Awaiting payment confirmation',
    body: 'We have received your order and are waiting for M-Pesa to confirm the payment. This page updates automatically.',
  };
}

export default function OrderConfirmation() {
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const orderKey = searchParams.get('key') ?? '';
  const mock = isMockMode();
  const orderId = Number(id);

  const orderQuery = useQuery({
    queryKey: ['order', orderId],
    queryFn: async (): Promise<StoreOrder | null> => {
      if (mock) return mockGetOrder(orderId);
      if (!orderKey) return null;
      return fetchOrder(orderId, orderKey);
    },
    enabled: Boolean(orderId),
    refetchInterval: (query) => {
      const order = query.state.data as StoreOrder | null | undefined;
      if (order && (order.status === 'processing' || order.status === 'completed' || order.status === 'failed' || order.status === 'cancelled')) {
        return false;
      }
      return 8000;
    },
  });

  const order = orderQuery.data;

  if (orderQuery.isLoading) {
    return (
      <PageTransition>
        <ShopSubnav />
        <Container className="py-24">
          <div className="mx-auto max-w-xl space-y-4 text-center">
            <div className="mx-auto size-10 animate-pulse rounded-full bg-ink/10" />
            <div className="mx-auto h-6 w-2/3 animate-pulse bg-ink/10" />
            <div className="mx-auto h-4 w-1/2 animate-pulse bg-ink/5" />
          </div>
        </Container>
      </PageTransition>
    );
  }

  if (!order) {
    return (
      <PageTransition>
        <SEO title="Order" description="Order details" path="/shop/order-confirmation" noindex />
        <ShopSubnav />
        <Container className="py-24">
          <ShopEmptyState
            eyebrow="Order not found"
            title="We could not find that order."
            description="Check the link, or contact us and we will help locate your order."
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

  const copy = statusCopy(order);
  const StatusIcon = copy.icon;
  const minor = order.totals.currency_minor_unit;

  return (
    <PageTransition>
      <SEO
        title={`Order ${order.order_number}`}
        description="Your Walking Shadow Poetry order confirmation."
        path="/shop/order-confirmation"
        noindex
      />

      <ShopSubnav />

      <section className="bg-ivory py-14 text-ink sm:py-20">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="border border-ink/15 bg-brand-tint/20 p-8 sm:p-12">
              <StatusIcon className={`size-8 ${copy.tone}`} strokeWidth={1.4} />
              <p className="eyebrow mt-6 text-ink/45">Order {order.order_number}</p>
              <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3.2rem)] leading-[1.02]">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/60">{copy.body}</p>

              <dl className="mt-8 grid gap-5 border-t border-ink/15 pt-8 sm:grid-cols-3">
                <div>
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">Status</dt>
                  <dd className="mt-1.5 text-sm capitalize text-ink">{order.status.replace(/-/g, ' ')}</dd>
                </div>
                <div>
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">Payment</dt>
                  <dd className="mt-1.5 text-sm text-ink">
                    {order.status === 'processing' || order.status === 'completed' ? 'Paid' : 'Pending'}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">Total</dt>
                  <dd className="mt-1.5 text-sm tabular-nums text-ink">
                    {formatMinor(order.total, minor)}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <div>
                <h2 className="flex items-center gap-2 font-display text-xl">
                  <Package className="size-4 text-terracotta" strokeWidth={1.5} />
                  Items
                </h2>
                <ul className="mt-4 space-y-4 border-t border-ink/15 pt-4">
                  {order.items.map((item) => (
                    <li key={item.key} className="flex justify-between gap-4 text-sm text-ink/70">
                      <span>
                        {item.quantity} × {item.name}
                        {item.variation.length > 0 && (
                          <span className="block text-xs text-ink/40">
                            {item.variation.map((variation) => variation.value).join(', ')}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 tabular-nums text-ink">
                        {formatMinor(item.totals.line_total, item.totals.currency_minor_unit)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="flex items-center gap-2 font-display text-xl">
                  <MapPin className="size-4 text-terracotta" strokeWidth={1.5} />
                  Delivery
                </h2>
                <address className="mt-4 border-t border-ink/15 pt-4 text-sm not-italic leading-relaxed text-ink/70">
                  {order.shipping_address.first_name} {order.shipping_address.last_name}
                  <br />
                  {order.shipping_address.address_1}
                  <br />
                  {order.shipping_address.city}
                  {order.shipping_address.state && `, ${order.shipping_address.state}`}
                  <br />
                  {order.shipping_address.country}
                  <br />
                  {order.shipping_address.phone}
                </address>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-ink/15 pt-8">
              <Button to="/shop/clothing" variant="dark">
                Continue shopping
              </Button>
              <Button to="/shop" variant="link">
                Back to the shop
              </Button>
            </div>

            <p className="mt-8 text-xs leading-relaxed text-ink/40">
              A confirmation email will be sent to{' '}
              <span className="text-ink/60">{order.billing_address.email || 'your email address'}</span>
              . If you do not receive it, please check your spam folder or contact us.
            </p>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

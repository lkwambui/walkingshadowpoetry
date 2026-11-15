import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock, Loader2, Smartphone } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import CartSummary from '../../components/shop/CartSummary';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ShopEmptyState from '../../components/shop/ShopEmptyState';
import { TextAreaField, TextField, SelectField } from '../../components/shop/FormField';
import { useCart } from '../../hooks/useCart';
import { kenyanCounties } from '../../data/shop';
import { MPESA_GATEWAY_ID } from '../../services/config';
import {
  StoreApiError,
  submitCheckout,
  formatMinor,
  type StoreOrder,
  type StoreShippingRate,
} from '../../services/storeApi';
import { getMpesaStatus, initiateMpesaPayment } from '../../services/commerce';
import { mockCreateOrder } from '../../services/mock/mockCart';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .regex(/^[+\d\s()-]{7,20}$/, 'Please enter a valid phone number.'),
  county: z.string().min(1, 'Please choose your county.'),
  town: z.string().trim().min(1, 'Please enter your town or city.'),
  address: z.string().trim().min(4, 'Please enter your delivery address.'),
  instructions: z.string().trim().optional(),
  mpesaPhone: z.string().trim().optional(),
  payment: z.literal('mpesa'),
});

type FormValues = z.infer<typeof schema>;

type Status = 'idle' | 'submitting' | 'awaiting' | 'error';

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, items, updateCustomer, selectShipping, refresh, isMock, reset } = useCart();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const orderRef = useRef<StoreOrder | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { payment: 'mpesa' },
  });

  useEffect(() => {
    if (items.length === 0 && status === 'idle') {
      // Cart is empty; the empty state below handles the UI.
    }
  }, [items.length, status]);

  const shippingRates: StoreShippingRate[] = cart?.shipping_rates ?? [];

  const finalizeOrder = (order: StoreOrder) => {
    orderRef.current = order;
    reset();
    navigate(`/shop/order-confirmation/${order.id}?key=${encodeURIComponent(order.order_key)}`);
  };

  const pollMpesa = async (order: StoreOrder) => {
    const maxAttempts = 30;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 3000));
      try {
        const result = await getMpesaStatus(order.id, order.order_key);
        if (result.paid || result.status === 'paid') {
          finalizeOrder(order);
          return;
        }
        if (result.status === 'failed' || result.status === 'cancelled') {
          setStatus('error');
          setError(
            result.result_desc ||
              'The payment was not completed. You can try again or choose another payment method.',
          );
          return;
        }
      } catch {
        /* keep polling through transient errors */
      }
    }
    setStatus('idle');
    setPendingMessage(
      'We are still waiting for M-Pesa to confirm your payment. If you approved the prompt, your order will be confirmed shortly. You can also check your order status.',
    );
    refresh();
  };

  const onSubmit = async (values: FormValues) => {
    setStatus('submitting');
    setError(null);
    setPendingMessage(null);

    const { firstName, lastName } = splitName(values.fullName);
    const address = {
      first_name: firstName,
      last_name: lastName,
      address_1: values.address,
      address_2: '',
      city: values.town,
      state: values.county,
      postcode: '',
      country: 'KE',
      phone: values.phone,
      email: values.email,
      company: '',
    };

    try {
      if (isMock) {
        const order = mockCreateOrder(address, values.instructions);
        finalizeOrder(order);
        return;
      }

      const updated = await updateCustomer(address);
      const rates = updated?.shipping_rates ?? [];
      const firstRate = rates[0]?.shipping_rates?.[0];
      if (firstRate && !firstRate.selected) {
        await selectShipping(rates[0].package_id, firstRate.rate_id);
      }

      const order = await submitCheckout({
        billing_address: address,
        shipping_address: address,
        customer_note: values.instructions,
        payment_method: MPESA_GATEWAY_ID,
        payment_data: [
          { key: 'mpesa_phone', value: values.mpesaPhone || values.phone },
        ],
      });

      orderRef.current = order;
      setStatus('awaiting');

      await initiateMpesaPayment({
        orderId: order.id,
        orderKey: order.order_key,
        phone: values.mpesaPhone || values.phone,
      });

      await pollMpesa(order);
    } catch (reason) {
      setStatus('error');
      if (reason instanceof StoreApiError) {
        setError(reason.message);
      } else if (reason instanceof Error) {
        setError(reason.message);
      } else {
        setError('Something went wrong while placing your order. Please try again.');
      }
    }
  };

  if (!cart || (items.length === 0 && status !== 'awaiting')) {
    return (
      <PageTransition>
        <SEO title="Checkout" description="Checkout" path="/shop/checkout" noindex />
        <ShopSubnav />
        <Container className="py-24">
          <ShopEmptyState
            eyebrow="Empty cart"
            title="There is nothing to check out yet."
            description="Add a piece to your cart to continue to checkout."
            action={
              <Button to="/shop/clothing" variant="dark">
                Explore the collection
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
        title="Checkout"
        description="Complete your Walking Shadow Poetry order. Guest checkout with M-Pesa."
        path="/shop/checkout"
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
              { label: 'Cart', path: '/shop/cart' },
              { label: 'Checkout' },
            ]}
          />

          <div className="mt-10">
            <p className="eyebrow text-terracotta">Secure checkout</p>
            <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] leading-[1.0]">
              Complete your order
            </h1>
            <p className="mt-3 max-w-xl text-sm text-ink/55">
              Guest checkout — no account required. Pay securely with M-Pesa.
            </p>
          </div>

          {status === 'awaiting' && (
            <div className="mt-10 flex items-start gap-4 border border-terracotta/30 bg-brand-tint px-5 py-5">
              <Loader2 className="mt-0.5 size-5 shrink-0 animate-spin text-terracotta" strokeWidth={1.6} />
              <div>
                <p className="font-display text-xl">Approve the M-Pesa prompt</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">
                  We have sent an STK push to your phone. Enter your M-Pesa PIN to confirm the
                  payment. Keep this page open — we will confirm automatically.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div role="alert" className="mt-10 border border-terracotta/40 bg-brand-tint px-5 py-4 text-sm text-brand-deep">
              {error}
            </div>
          )}

          {pendingMessage && (
            <div role="status" className="mt-10 border border-green/30 bg-green-tint px-5 py-4 text-sm text-green-deep">
              {pendingMessage}
            </div>
          )}

          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-10">
                <fieldset disabled={status === 'awaiting' || status === 'submitting'}>
                  <legend className="eyebrow text-ink/45">Contact</legend>
                  <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    <TextField
                      label="Full name"
                      autoComplete="name"
                      error={errors.fullName?.message}
                      {...register('fullName')}
                    />
                    <TextField
                      label="Email address"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <TextField
                      label="Phone number"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+254 …"
                      error={errors.phone?.message}
                      {...register('phone')}
                    />
                  </div>
                </fieldset>

                <fieldset disabled={status === 'awaiting' || status === 'submitting'}>
                  <legend className="eyebrow text-ink/45">Delivery</legend>
                  <div className="mt-6 grid gap-8 sm:grid-cols-2">
                    <SelectField
                      label="County"
                      options={kenyanCounties}
                      error={errors.county?.message}
                      {...register('county')}
                    />
                    <TextField
                      label="Town / City"
                      autoComplete="address-level2"
                      error={errors.town?.message}
                      {...register('town')}
                    />
                    <TextField
                      label="Delivery address"
                      autoComplete="street-address"
                      className="sm:col-span-2"
                      placeholder="Building, street, landmark"
                      error={errors.address?.message}
                      {...register('address')}
                    />
                  </div>

                  <div className="mt-8">
                    <TextAreaField
                      label="Additional delivery instructions"
                      rows={3}
                      placeholder="Gate code, preferred delivery time, landmark (optional)."
                      error={errors.instructions?.message}
                      {...register('instructions')}
                    />
                  </div>

                  {shippingRates.length > 0 && (
                    <div className="mt-8 border-t border-ink/15 pt-6">
                      <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/45">
                        Delivery method
                      </p>
                      <ul className="mt-3 space-y-2">
                        {shippingRates.flatMap((rate) =>
                          rate.shipping_rates.map((option) => (
                            <li
                              key={option.rate_id}
                              className="flex items-center justify-between gap-4 text-sm text-ink/70"
                            >
                              <span>
                                {option.name}
                                {option.delivery_time && (
                                  <span className="text-ink/40"> · {option.delivery_time}</span>
                                )}
                              </span>
                              <span className="tabular-nums text-ink">
                                {formatMinor(option.price, option.currency_minor_unit)}
                              </span>
                            </li>
                          )),
                        )}
                      </ul>
                    </div>
                  )}
                </fieldset>

                <fieldset disabled={status === 'awaiting' || status === 'submitting'}>
                  <legend className="eyebrow text-ink/45">Payment</legend>
                  <div className="mt-6 space-y-4">
                    <label className="flex cursor-pointer items-start gap-4 border border-ink/20 p-5 transition-colors has-[:checked]:border-ink">
                      <input
                        type="radio"
                        value="mpesa"
                        className="mt-1 size-4 accent-ink"
                        {...register('payment')}
                      />
                      <span>
                        <span className="flex items-center gap-2 font-display text-xl">
                          <Smartphone className="size-4 text-terracotta" strokeWidth={1.6} />
                          M-Pesa
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-ink/55">
                          You will receive an STK push prompt on your phone to approve the payment
                          securely.
                        </span>
                      </span>
                    </label>

                    <TextField
                      label="M-Pesa phone number (if different)"
                      type="tel"
                      placeholder="Leave blank to use the number above"
                      error={errors.mpesaPhone?.message}
                      {...register('mpesaPhone')}
                    />
                  </div>
                </fieldset>

                <div className="flex flex-col gap-4 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex max-w-xs items-center gap-2 text-xs leading-relaxed text-ink/40">
                    <Lock className="size-3.5 shrink-0" strokeWidth={1.6} />
                    Payments are verified server-side. We never mark an order paid from the browser.
                  </p>
                  <button
                    type="submit"
                    disabled={status === 'submitting' || status === 'awaiting'}
                    className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:opacity-50"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="size-4 animate-spin" strokeWidth={1.6} />
                        Placing order…
                      </>
                    ) : status === 'awaiting' ? (
                      'Awaiting payment…'
                    ) : (
                      <>
                        <CheckCircle2 className="size-4" strokeWidth={1.6} />
                        Place order & pay
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-40">
                <CartSummary cart={cart} showShipping />
                <ul className="mt-6 space-y-3 border-t border-ink/15 pt-6">
                  {items.map((item) => (
                    <li key={item.key} className="flex justify-between gap-4 text-xs text-ink/60">
                      <span>
                        {item.quantity} × {item.name}
                        {item.variation.length > 0 && (
                          <span className="block text-ink/40">
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
            </div>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

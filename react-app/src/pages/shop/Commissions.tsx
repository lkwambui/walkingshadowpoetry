import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowUpRight, CheckCircle2, Feather } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Reveal from '../../components/common/Reveal';
import ShopSubnav from '../../components/shop/ShopSubnav';
import ProductGrid from '../../components/shop/ProductGrid';
import { SelectField, TextAreaField, TextField } from '../../components/shop/FormField';
import { useProducts } from '../../hooks/useShopData';
import { submitCommission } from '../../services/commerce';
import {
  commissionLengths,
  occasions,
  poetryTypes,
  writingTones,
} from '../../data/shop';
import { site } from '../../data/site';

const schema = z.object({
  customerName: z.string().trim().min(1, 'Please share your name.'),
  email: z.string().trim().email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Please share a phone number we can reach you on.')
    .regex(/^[+\d\s()-]{7,20}$/, 'Please enter a valid phone number.'),
  poetryType: z.string().min(1, 'Please choose a type of poetry.'),
  recipient: z.string().trim().min(1, 'Who is this poem for?'),
  occasion: z.string().min(1, 'Please choose an occasion.'),
  theme: z.string().trim().min(3, 'Please share the theme or subject.'),
  tone: z.string().min(1, 'Please choose a preferred tone.'),
  length: z.string().min(1, 'Please choose an approximate length.'),
  details: z.string().trim().min(30, 'Please share a little more detail (at least 30 characters).'),
  instructions: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function Commissions() {
  const fixedPrice = useProducts({ category: 'poetry-commissions', perPage: 6 });
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const result = await submitCommission({
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        poetryType: values.poetryType,
        recipient: values.recipient,
        occasion: values.occasion,
        theme: values.theme,
        tone: values.tone,
        length: values.length,
        details: values.details,
        instructions: values.instructions || '',
      });
      setReference(result.reference ?? 'WSP-COMMISSION');
      reset();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : 'We could not submit your request. Please try again or contact us directly.',
      );
    }
  };

  const hasFixedPrice = (fixedPrice.data?.length ?? 0) > 0;

  return (
    <PageTransition>
      <SEO
        title="Commission a poem"
        description="Commission a bespoke poem from Walking Shadow Poetry for a birthday, anniversary, love, friendship or milestone. Tell us the story and we will write the words."
        path="/shop/commissions"
        image="/media/poetry/my-love-poem.webp"
        jsonLd={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
            { '@type': 'ListItem', position: 3, name: 'Poetry Commissions' },
          ],
        }}
      />

      <ShopSubnav />

      <section className="bg-ink py-16 text-ivory sm:py-20">
        <Container>
          <Breadcrumbs
            tone="dark"
            className="mb-12"
            items={[
              { label: 'Home', path: '/' },
              { label: 'Shop', path: '/shop' },
              { label: 'Poetry Commissions' },
            ]}
          />
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-sand">Commissioned poetry</p>
              <h1 className="mt-5 font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.94]">
                A poem written for <em className="text-sand">the moment.</em>
              </h1>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ivory/70 lg:col-span-4 lg:col-start-9">
              For occasions that deserve their own words. Share the story and we will compose a piece
              made entirely for the person and the milestone.
            </p>
          </div>
        </Container>
      </section>

      {hasFixedPrice && (
        <section className="bg-brand-tint/20 py-16 text-ink sm:py-20">
          <Container>
            <p className="eyebrow text-terracotta">Order directly</p>
            <h2 className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.8rem)]">
              Commissioned pieces you can order now
            </h2>
            <div className="mt-10">
              <ProductGrid products={fixedPrice.data ?? []} columns={4} />
            </div>
          </Container>
        </section>
      )}

      <section className="bg-ivory py-16 text-ink sm:py-24">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              {reference ? (
                <div className="border border-green/30 bg-green-tint px-7 py-10">
                  <CheckCircle2 className="size-7 text-green-deep" strokeWidth={1.4} />
                  <h2 className="mt-5 font-display text-3xl">Your commission has been received.</h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink/70">
                    Thank you. Our writers will review your request and respond with a proposal and
                    pricing. Your reference is{' '}
                    <span className="font-sans tracking-[0.1em] text-ink">{reference}</span>. Keep it
                    for your records.
                  </p>
                  <button
                    type="button"
                    onClick={() => setReference(null)}
                    className="mt-7 inline-flex items-center gap-3 border-b border-ink/40 pb-2 text-[0.62rem] uppercase tracking-[0.2em] text-ink/70 transition-colors hover:border-ink hover:text-ink"
                  >
                    Submit another commission
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-t border-ink/15 pt-8">
                    <p className="eyebrow text-terracotta">Commission request</p>
                    <h2 className="mt-3 max-w-xl font-display text-[clamp(2rem,4vw,3.4rem)] leading-[1.0]">
                      Tell us about the piece you have in mind.
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
                      Complete the form and our team will respond with a proposal. Commissions are
                      priced individually based on length, detail and delivery.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 space-y-8">
                    {serverError && (
                      <div role="alert" className="border border-terracotta/40 bg-brand-tint px-4 py-3 text-sm text-brand-deep">
                        {serverError}
                      </div>
                    )}

                    <div className="grid gap-8 sm:grid-cols-2">
                      <TextField
                        label="Your name"
                        autoComplete="name"
                        error={errors.customerName?.message}
                        {...register('customerName')}
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
                      <SelectField
                        label="Type of poetry"
                        options={poetryTypes}
                        error={errors.poetryType?.message}
                        {...register('poetryType')}
                      />
                      <TextField
                        label="Intended recipient"
                        placeholder="Who is it for?"
                        error={errors.recipient?.message}
                        {...register('recipient')}
                      />
                      <SelectField
                        label="Occasion"
                        options={occasions}
                        error={errors.occasion?.message}
                        {...register('occasion')}
                      />
                      <SelectField
                        label="Preferred tone"
                        options={writingTones}
                        error={errors.tone?.message}
                        {...register('tone')}
                      />
                      <SelectField
                        label="Approximate length"
                        options={commissionLengths}
                        error={errors.length?.message}
                        {...register('length')}
                      />
                    </div>

                    <TextField
                      label="Theme or subject"
                      placeholder="e.g. a father’s quiet sacrifice"
                      error={errors.theme?.message}
                      {...register('theme')}
                    />

                    <TextAreaField
                      label="Important details"
                      rows={6}
                      placeholder="Names, memories, qualities, milestones, phrases they love — anything that makes the piece true."
                      error={errors.details?.message}
                      {...register('details')}
                    />

                    <TextAreaField
                      label="Special instructions"
                      rows={3}
                      placeholder="Deadlines, delivery format, performance notes (optional)."
                      error={errors.instructions?.message}
                      {...register('instructions')}
                    />

                    <div className="flex flex-col gap-4 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
                      <p className="max-w-xs text-xs leading-relaxed text-ink/40">
                        We respond within a few working days. No payment is taken on this form.
                      </p>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending…' : 'Submit commission request'}
                        <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <div className="border border-ink/15 bg-brand-tint/20 p-7 lg:sticky lg:top-40">
                <Feather className="size-4 text-terracotta" strokeWidth={1.5} />
                <h2 className="mt-4 font-display text-2xl">Commissioned work</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  Every commission is written individually. We will confirm the brief, propose a
                  price and a timeline before any work begins.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink/60">
                  {[
                    'Free-verse, spoken-word, rhyming and more',
                    'Digital or printed delivery',
                    'Performance-ready pieces on request',
                    'Rush timelines considered on request',
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 size-1 shrink-0 bg-terracotta" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-ink/15 pt-6 text-xs leading-relaxed text-ink/55">
                  Prefer to talk first?{' '}
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
            </Reveal>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

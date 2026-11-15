import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, CheckCircle2, Info } from 'lucide-react';
import Container from '../../components/common/Container';
import PageTransition from '../../components/common/PageTransition';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import Button from '../../components/common/Button';
import ShopSubnav from '../../components/shop/ShopSubnav';
import { SelectField, TextAreaField, TextField } from '../../components/shop/FormField';
import { useProducts } from '../../hooks/useShopData';
import { useCart } from '../../hooks/useCart';
import { deliveryFormats, noteLengths, occasions, writingTones } from '../../data/shop';
import { site } from '../../data/site';
import { formatStorePrice } from '../../services/storeApi';
import { cn } from '../../utils/format';

const schema = z.object({
  productId: z.string().min(1, 'Please choose the type of piece.'),
  recipientName: z.string().trim().min(1, 'Please share the recipient’s name.'),
  occasion: z.string().min(1, 'Please choose an occasion.'),
  theme: z.string().trim().min(3, 'Tell us the theme or subject in a few words.'),
  tone: z.string().min(1, 'Please choose a writing tone.'),
  keyDetails: z.string().trim().min(20, 'Share a little more so the piece feels true (at least 20 characters).'),
  length: z.string().min(1, 'Please choose an approximate length.'),
  deliveryFormat: z.string().min(1, 'Please choose a delivery format.'),
  instructions: z.string().trim().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function CustomizedNote() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, isMutating } = useCart();
  const products = useProducts({ category: 'personalized-notes', perPage: 20 });
  const preselect = searchParams.get('product') ?? '';

  const productOptions = useMemo(
    () =>
      (products.data ?? []).map((product) => ({
        value: String(product.id),
        label: `${product.name} — ${formatStorePrice(product.prices)}`,
      })),
    [products.data],
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      productId: preselect,
      deliveryFormat: deliveryFormats[0],
      tone: '',
      occasion: '',
      length: '',
      recipientName: '',
      theme: '',
      keyDetails: '',
      instructions: '',
    },
  });

  useEffect(() => {
    if (preselect) setValue('productId', preselect);
  }, [preselect, setValue]);

  const onSubmit = async (values: FormValues) => {
    await addItem({
      id: Number(values.productId),
      quantity: 1,
      personalization: {
        productKind: 'customized-note',
        recipientName: values.recipientName,
        occasion: values.occasion,
        theme: values.theme,
        tone: values.tone,
        keyDetails: values.keyDetails,
        length: values.length,
        instructions: values.instructions || '',
        deliveryFormat: values.deliveryFormat,
      },
    });
    navigate('/shop/cart');
  };

  return (
    <PageTransition>
      <SEO
        title="Create a personalized note"
        description="Create a personalized handwritten-style note. Choose the recipient, occasion, tone and details, and Walking Shadow Poetry writes it for them."
        path="/shop/personalized/notes"
        image="/media/poetry/dear-mom.webp"
        jsonLd={{
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: `${site.url}/shop` },
            { '@type': 'ListItem', position: 3, name: 'Personalized Pieces', item: `${site.url}/shop/personalized` },
            { '@type': 'ListItem', position: 4, name: 'Customized Note' },
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
              { label: 'Personalized Pieces', path: '/shop/personalized' },
              { label: 'Customized Note' },
            ]}
          />

          <div className="mt-10 grid gap-14 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-terracotta">Customized note</p>
              <h1 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.0]">
                Tell us who it is for.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
                You do not need to write the poem yourself. Share the person, the occasion and the
                details that matter — we will shape the words around them.
              </p>

              {isSubmitSuccessful ? null : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-10 space-y-8">
                  <SelectField
                    label="Type of piece"
                    error={errors.productId?.message}
                    options={productOptions}
                    placeholder={products.isLoading ? 'Loading options…' : 'Choose a note or poem'}
                    {...register('productId')}
                  />

                  <div className="grid gap-8 sm:grid-cols-2">
                    <TextField
                      label="Recipient’s name"
                      placeholder="Who is this for?"
                      error={errors.recipientName?.message}
                      {...register('recipientName')}
                    />
                    <SelectField
                      label="Occasion"
                      options={occasions}
                      error={errors.occasion?.message}
                      {...register('occasion')}
                    />
                    <SelectField
                      label="Writing tone"
                      options={writingTones}
                      error={errors.tone?.message}
                      {...register('tone')}
                    />
                    <SelectField
                      label="Approximate length"
                      options={noteLengths}
                      error={errors.length?.message}
                      {...register('length')}
                    />
                  </div>

                  <TextField
                    label="Message theme"
                    placeholder="e.g. a mother who never gave up"
                    error={errors.theme?.message}
                    hint="A few words describing the subject or feeling."
                    {...register('theme')}
                  />

                  <TextAreaField
                    label="Key details to include"
                    rows={6}
                    placeholder="Names, memories, inside jokes, qualities, milestones — anything that makes this feel true to them."
                    error={errors.keyDetails?.message}
                    hint="The more you share, the more personal the piece becomes."
                    {...register('keyDetails')}
                  />

                  <SelectField
                    label="Delivery format"
                    options={deliveryFormats}
                    error={errors.deliveryFormat?.message}
                    {...register('deliveryFormat')}
                  />

                  <TextAreaField
                    label="Additional instructions"
                    rows={3}
                    placeholder="Anything else we should know (optional)."
                    error={errors.instructions?.message}
                    {...register('instructions')}
                  />

                  <div className="flex flex-col gap-4 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-xs leading-relaxed text-ink/40">
                      Your customization is attached to the order item and visible to our team during
                      fulfilment.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting || isMutating}
                      className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:opacity-50"
                    >
                      {isSubmitting || isMutating ? 'Adding…' : 'Add personalized note to cart'}
                      <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <div className="border border-ink/15 bg-brand-tint/20 p-7 lg:sticky lg:top-40">
                <Info className="size-4 text-terracotta" strokeWidth={1.5} />
                <h2 className="mt-4 font-display text-2xl">How it works</h2>
                <ol className="mt-5 space-y-4 text-sm text-ink/60">
                  {[
                    'Share the recipient, occasion and details.',
                    'Add the personalized piece to your cart.',
                    'Our writers craft the piece by hand.',
                    'Receive it digitally or printed, ready to give.',
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="font-sans text-[0.6rem] tracking-[0.2em] text-terracotta">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="mt-7 border-t border-ink/15 pt-6">
                  <CheckCircle2 className="size-4 text-green-deep" strokeWidth={1.5} />
                  <p className="mt-3 text-xs leading-relaxed text-ink/55">
                    Writing takes a few days depending on length and demand. If you need it urgently,
                    mention it in your instructions or{' '}
                    <a
                      href={site.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-terracotta underline-offset-4"
                    >
                      message us on WhatsApp
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>

          {isSubmitSuccessful && (
            <div className={cn('mt-10 border border-green/30 bg-green-tint px-5 py-4 text-sm text-green-deep')}>
              Added to your cart. Taking you to the cart…
            </div>
          )}

          <div className="mt-16 border-t border-ink/15 pt-8">
            <Button to="/shop/commissions" variant="link">
              Prefer a full commissioned poem?
            </Button>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

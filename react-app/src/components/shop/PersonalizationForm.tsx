import { useEffect, useMemo, useState } from 'react';
import { useForm, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, CircleAlert, PenLine } from 'lucide-react';
import { SelectField, TextAreaField, TextField } from './FormField';
import {
  commissionLengths,
  deliveryFormats,
  noteLengths,
  occasions,
  poetryTypes,
  relationships,
  writingTones,
} from '../../data/shop';
import {
  personalizationLimits,
  personalizationSchema,
  personalizationSteps,
  reviewFields,
  toPersonalizationData,
  type PersonalizationValues,
} from '../../services/personalization';
import { formatStorePrice, type StoreProduct } from '../../services/storeApi';
import { productIsPersonalized } from '../../services/productUtils';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../utils/format';

interface PersonalizationFormProps {
  product: StoreProduct;
  products: StoreProduct[];
  lockedProduct?: boolean;
}

const yesNoOptions: { value: string; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' },
];

function isCommission(product: StoreProduct) {
  return (
    product.categories.some((category) => category.slug.includes('commission')) ||
    product.slug.includes('commission')
  );
}

export default function PersonalizationForm({ product, products, lockedProduct = false }: PersonalizationFormProps) {
  const navigate = useNavigate();
  const { addItem, isMutating } = useCart();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const options = useMemo(() => {
    const seen = new Set<number>();
    return [product, ...products]
      .filter((item) => productIsPersonalized(item))
      .filter((item) => !seen.has(item.id) && seen.add(item.id))
      .map((item) => ({
        value: String(item.id),
        label: `${item.name} — ${formatStorePrice(item.prices)}`,
      }));
  }, [product, products]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalizationValues>({
    resolver: zodResolver(personalizationSchema),
    mode: 'onBlur',
    defaultValues: {
      productId: String(product.id),
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      recipientName: '',
      relationship: '',
      pronunciation: '',
      occasion: '',
      otherOccasion: '',
      message: '',
      story: '',
      memories: '',
      importantDetails: '',
      poeticStyle: '',
      tone: '',
      length: '',
      instructions: '',
      surprise: 'no',
      preferredDate: '',
      dedication: 'no',
      dedicationText: '',
      privatePoem: 'no',
      deliveryFormat: deliveryFormats[0],
    },
  });

  useEffect(() => {
    if (lockedProduct) setValue('productId', String(product.id));
  }, [lockedProduct, product.id, setValue]);

  const values = watch();
  const selected = products.find((item) => String(item.id) === values.productId) ?? product;
  const productKind = isCommission(selected) ? 'commissioned-poem' : 'customized-note';
  const current = personalizationSteps[step];
  const isLastStep = step === personalizationSteps.length - 1;
  const invalidFields = Object.keys(errors);

  const next = async () => {
    const valid = await trigger(current.fields as Path<PersonalizationValues>[], { shouldFocus: true });
    if (valid) {
      setSubmitError(null);
      setStep((index) => Math.min(index + 1, personalizationSteps.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const back = () => {
    setSubmitError(null);
    setStep((index) => Math.max(index - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (formValues: PersonalizationValues) => {
    setSubmitError(null);
    try {
      await addItem({
        id: Number(formValues.productId),
        quantity: 1,
        personalization: toPersonalizationData(formValues, productKind),
      });
      navigate('/shop/cart');
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : 'We could not add this piece to your cart.');
    }
  };

  const fieldProps = (name: keyof PersonalizationValues) => ({
    'aria-invalid': Boolean(errors[name]),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-3 sm:grid-cols-4" aria-label="Personalization progress">
        {personalizationSteps.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => index < step && setStep(index)}
            disabled={index > step}
            aria-current={index === step ? 'step' : undefined}
            className={cn(
              'border px-3 py-3 text-left transition-colors',
              index === step
                ? 'border-terracotta bg-terracotta/5 text-ink'
                : index < step
                  ? 'border-green/40 text-green-deep'
                  : 'border-ink/10 text-ink/30',
              index < step && 'cursor-pointer',
            )}
          >
            <span className="font-sans text-[0.55rem] tracking-[0.18em]">0{index + 1}</span>
            <span className="mt-1 block text-xs">{item.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <p className="eyebrow text-terracotta">Step {step + 1} of {personalizationSteps.length}</p>
        <h2 className="mt-3 font-display text-3xl">{current.eyebrow}</h2>

        <div className="mt-8 space-y-8">
          {current.fields.includes('productId') &&
            (lockedProduct ? (
              <div className="border border-ink/15 bg-brand-tint/25 p-5">
                <p className="eyebrow text-ink/45">Your piece</p>
                <p className="mt-2 font-display text-xl">{product.name}</p>
                <p className="mt-2 text-xs text-ink/55">{formatStorePrice(product.prices)}</p>
                <input type="hidden" {...register('productId')} />
              </div>
            ) : (
              <SelectField
                label="Type of piece"
                required
                options={options}
                placeholder="Choose a note or poem"
                error={errors.productId?.message}
                {...register('productId')}
                {...fieldProps('productId')}
              />
            ))}

          {current.fields.includes('customerName') && (
            <TextField
              label="Your name"
              required
              maxLength={personalizationLimits.customerName}
              placeholder="The person commissioning this piece"
              error={errors.customerName?.message}
              {...register('customerName')}
              {...fieldProps('customerName')}
            />
          )}

          {current.fields.includes('customerEmail') && (
            <TextField
              label="Your email"
              type="email"
              required
              maxLength={personalizationLimits.customerEmail}
              placeholder="Where should we send updates?"
              error={errors.customerEmail?.message}
              {...register('customerEmail')}
              {...fieldProps('customerEmail')}
            />
          )}

          {current.fields.includes('customerPhone') && (
            <TextField
              label="Contact number"
              type="tel"
              maxLength={personalizationLimits.customerPhone}
              placeholder="Optional — for urgent questions"
              error={errors.customerPhone?.message}
              {...register('customerPhone')}
              {...fieldProps('customerPhone')}
            />
          )}

          {current.fields.includes('recipientName') && (
            <TextField
              label="Recipient’s name"
              required
              maxLength={personalizationLimits.recipientName}
              placeholder="Who is this for?"
              error={errors.recipientName?.message}
              {...register('recipientName')}
              {...fieldProps('recipientName')}
            />
          )}

          {current.fields.includes('relationship') && (
            <SelectField
              label="Your relationship"
              required
              options={relationships}
              error={errors.relationship?.message}
              {...register('relationship')}
              {...fieldProps('relationship')}
            />
          )}

          {current.fields.includes('pronunciation') && (
            <TextField
              label="Preferred name or pronunciation"
              maxLength={personalizationLimits.pronunciation}
              placeholder="Optional — help us get it right"
              error={errors.pronunciation?.message}
              {...register('pronunciation')}
              {...fieldProps('pronunciation')}
            />
          )}

          {current.fields.includes('occasion') && (
            <SelectField
              label="Occasion"
              required
              options={occasions}
              error={errors.occasion?.message}
              {...register('occasion')}
              {...fieldProps('occasion')}
            />
          )}

          {current.fields.includes('otherOccasion') && values.occasion === 'Other' && (
            <TextField
              label="Describe the occasion"
              required
              maxLength={80}
              placeholder="e.g. a retirement celebration"
              error={errors.otherOccasion?.message}
              {...register('otherOccasion')}
              {...fieldProps('otherOccasion')}
            />
          )}

          {current.fields.includes('message') && (
            <TextAreaField
              label="What should the piece communicate?"
              required
              rows={4}
              maxLength={personalizationLimits.message}
              placeholder="Love, gratitude, apology, encouragement…"
              hint={`${values.message?.length ?? 0} / ${personalizationLimits.message} characters`}
              error={errors.message?.message}
              {...register('message')}
              {...fieldProps('message')}
            />
          )}

          {current.fields.includes('story') && (
            <TextAreaField
              label="The story behind it"
              required
              rows={7}
              maxLength={personalizationLimits.story}
              placeholder="Tell us what happened, who they are and why this moment matters."
              hint={`${values.story?.length ?? 0} / ${personalizationLimits.story} characters`}
              error={errors.story?.message}
              {...register('story')}
              {...fieldProps('story')}
            />
          )}

          {current.fields.includes('memories') && (
            <TextAreaField
              label="Special memories to include"
              rows={4}
              maxLength={personalizationLimits.memories}
              placeholder="Optional — a place, an inside joke, a phrase they love."
              error={errors.memories?.message}
              {...register('memories')}
              {...fieldProps('memories')}
            />
          )}

          {current.fields.includes('importantDetails') && (
            <TextAreaField
              label="Details to get right"
              rows={3}
              maxLength={personalizationLimits.importantDetails}
              placeholder="Optional — names, dates, spelling, anything to avoid."
              error={errors.importantDetails?.message}
              {...register('importantDetails')}
              {...fieldProps('importantDetails')}
            />
          )}

          {current.fields.includes('poeticStyle') && (
            <SelectField
              label="Preferred style"
              required
              options={poetryTypes}
              error={errors.poeticStyle?.message}
              {...register('poeticStyle')}
              {...fieldProps('poeticStyle')}
            />
          )}

          {current.fields.includes('tone') && (
            <SelectField
              label="Tone"
              required
              options={writingTones}
              error={errors.tone?.message}
              {...register('tone')}
              {...fieldProps('tone')}
            />
          )}

          {current.fields.includes('length') && (
            <SelectField
              label="Preferred length"
              required
              options={productKind === 'commissioned-poem' ? commissionLengths : noteLengths}
              error={errors.length?.message}
              {...register('length')}
              {...fieldProps('length')}
            />
          )}

          {current.fields.includes('instructions') && (
            <TextAreaField
              label="Additional instructions"
              rows={3}
              maxLength={personalizationLimits.instructions}
              placeholder="Optional — anything else our writers should know."
              error={errors.instructions?.message}
              {...register('instructions')}
              {...fieldProps('instructions')}
            />
          )}

          {current.fields.includes('deliveryFormat') && (
            <SelectField
              label="Delivery format"
              required
              options={deliveryFormats}
              error={errors.deliveryFormat?.message}
              {...register('deliveryFormat')}
              {...fieldProps('deliveryFormat')}
            />
          )}

          {current.fields.includes('surprise') && (
            <SelectField
              label="Is this a surprise gift?"
              required
              options={yesNoOptions}
              error={errors.surprise?.message}
              {...register('surprise')}
              {...fieldProps('surprise')}
            />
          )}

          {current.fields.includes('preferredDate') && (
            <TextField
              label="Preferred delivery date"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              error={errors.preferredDate?.message}
              {...register('preferredDate')}
              {...fieldProps('preferredDate')}
            />
          )}

          {current.fields.includes('dedication') && (
            <SelectField
              label="Include a dedication?"
              required
              options={yesNoOptions}
              error={errors.dedication?.message}
              {...register('dedication')}
              {...fieldProps('dedication')}
            />
          )}

          {current.fields.includes('dedicationText') && values.dedication === 'yes' && (
            <TextAreaField
              label="Dedication wording"
              required
              rows={3}
              maxLength={personalizationLimits.dedicationText}
              placeholder="Write the dedication exactly as it should appear."
              error={errors.dedicationText?.message}
              {...register('dedicationText')}
              {...fieldProps('dedicationText')}
            />
          )}

          {current.fields.includes('privatePoem') && (
            <SelectField
              label="Keep the poem private to the recipient?"
              required
              options={yesNoOptions}
              error={errors.privatePoem?.message}
              {...register('privatePoem')}
              {...fieldProps('privatePoem')}
            />
          )}
        </div>

        {isLastStep && (
          <div className="mt-10 border border-ink/15 bg-brand-tint/20 p-6">
            <div className="flex items-center gap-3">
              <PenLine className="size-4 text-terracotta" strokeWidth={1.5} />
              <h3 className="font-display text-xl">Review your details</h3>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              {reviewFields
                .filter(({ key }) => values[key])
                .map(({ key, label }) => (
                  <div key={key}>
                    <dt className="text-[0.55rem] uppercase tracking-[0.16em] text-ink/40">{label}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink/75">
                      {key === 'surprise' || key === 'dedication' || key === 'privatePoem'
                        ? values[key] === 'yes'
                          ? 'Yes'
                          : 'No'
                        : String(values[key])}
                    </dd>
                  </div>
                ))}
            </dl>
            {invalidFields.length > 0 && (
              <p className="mt-5 flex items-start gap-2 text-xs text-terracotta" role="alert">
                <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
                Please check the highlighted details before adding this piece to your cart.
              </p>
            )}
          </div>
        )}
      </div>

      {submitError && (
        <p className="mt-6 border border-terracotta/30 bg-terracotta/5 px-4 py-3 text-sm text-terracotta" role="alert">
          {submitError}
        </p>
      )}

      <div className="mt-10 flex flex-col-reverse gap-4 border-t border-ink/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center justify-center gap-3 px-2 py-3 text-[0.62rem] uppercase tracking-[0.2em] text-ink/55 transition-colors hover:text-terracotta"
          >
            <ArrowLeft className="size-4" strokeWidth={1.6} />
            Back
          </button>
        ) : (
          <span />
        )}

        {!isLastStep ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
          >
            Continue
            <ArrowRight className="size-4" strokeWidth={1.6} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || isMutating}
            className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting || isMutating ? 'Adding…' : 'Add personalized piece to cart'}
            {!(isSubmitting || isMutating) && <Check className="size-4" strokeWidth={1.6} />}
          </button>
        )}
      </div>
    </form>
  );
}

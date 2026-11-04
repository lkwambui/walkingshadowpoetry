import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import Container from '../components/common/Container';
import PageHero from '../components/common/PageHero';
import PageTransition from '../components/common/PageTransition';
import Reveal from '../components/common/Reveal';
import SEO from '../components/common/SEO';
import { bookingEventTypes, site, socialLinks } from '../data/site';
import { cn } from '../utils/format';

const breadcrumbs = [{ label: 'Home', path: '/' }, { label: 'Contact' }];

const breadcrumbLd = {
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.path ? { item: `${site.url}${item.path}` } : {}),
  })),
};

interface FormValues {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  location: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  location: '',
  message: '',
};

const fieldClass =
  'w-full border-0 border-b border-ink/25 bg-transparent py-3 text-sm text-ink placeholder:text-ink/30 focus:border-terracotta focus:outline-none focus:ring-0';

const labelClass = 'mb-1 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/45';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) errors.name = 'Please share your name.';
  if (!values.email.trim()) {
    errors.email = 'Please share an email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.eventType) errors.eventType = 'Please choose the type of enquiry.';
  if (!values.message.trim()) {
    errors.message = 'Please tell us a little about what you have in mind.';
  } else if (values.message.trim().length < 20) {
    errors.message = 'A little more detail will help us respond well (at least 20 characters).';
  }
  if (values.phone.trim() && !/^[+\d\s()-]{7,20}$/.test(values.phone.trim())) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  const update =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (errors[field]) {
        setErrors((current) => ({ ...current, [field]: undefined }));
      }
      if (status !== 'idle') setStatus('idle');
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error');
      window.requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
        firstInvalid?.focus();
      });
      return;
    }

    const subject = `Booking enquiry — ${values.eventType}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      values.phone ? `Phone: ${values.phone}` : null,
      `Enquiry: ${values.eventType}`,
      values.eventDate ? `Event date: ${values.eventDate}` : null,
      values.location ? `Location: ${values.location}` : null,
      '',
      values.message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('ready');
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <PageTransition>
      <SEO
        title="Contact & bookings"
        description="Get in touch with Walking Shadow Poetry in Nakuru, Kenya. Enquire about poetry performances, spoken-word features, workshops and creative collaborations."
        path="/contact"
        image="/media/contact/contact-studio.webp"
        jsonLd={[
          breadcrumbLd,
          {
            '@type': 'ContactPage',
            name: `Contact ${site.name}`,
            description:
              'Booking and contact page for Walking Shadow Poetry, a spoken-word and storytelling platform in Nakuru, Kenya.',
            mainEntity: { '@id': `${site.url}/#organisation` },
          },
        ]}
      />

      <PageHero
        eyebrow="Start a conversation"
        title={
          <>
            Bring a voice to <em className="text-sand">the room.</em>
          </>
        }
        intro="For performances, spoken-word features, workshops and creative collaborations. Tell us what you are planning and we will take it from there."
        image="/media/contact/contact-studio.webp"
        imageAlt="The Walking Shadow Poetry studio in Nakuru"
        breadcrumbs={breadcrumbs}
      />

      <section className="bg-ivory py-20 text-ink sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7">
              <div className="border-t border-ink/15 pt-8">
                <p className="eyebrow text-terracotta">Booking enquiry</p>
                <h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,4vw,3.6rem)] leading-[1.0]">
                  Tell us about the moment you are creating.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/55">
                  Complete the form and your email app will open with the message ready to send.
                  Prefer a direct conversation? Reach us by phone, email or WhatsApp.
                </p>

                <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-10 space-y-7">
                  {status === 'error' && (
                    <div
                      role="alert"
                      className="border border-brand/40 bg-brand-tint px-4 py-3 text-sm text-brand-deep"
                    >
                      Please check the highlighted fields and try again.
                    </div>
                  )}

                  {status === 'ready' && (
                    <div
                      role="status"
                      className="flex items-start gap-3 border border-green/30 bg-green-tint px-4 py-4 text-sm text-green-deep"
                    >
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-deep" strokeWidth={1.5} />
                      <span>
                        Your email app should now be open with the message ready to send. If it did
                        not open, write to{' '}
                        <a
                          href={`mailto:${site.email}`}
                          className="underline decoration-green underline-offset-4"
                        >
                          {site.email}
                        </a>
                        .
                      </span>
                    </div>
                  )}

                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Your name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={update('name')}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        placeholder="Full name"
                        className={cn(fieldClass, errors.name && 'border-terracotta')}
                        required
                      />
                      {errors.name && (
                        <p id="name-error" className="mt-2 text-xs text-terracotta">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email address <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={update('email')}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        placeholder="you@example.com"
                        className={cn(fieldClass, errors.email && 'border-terracotta')}
                        required
                      />
                      {errors.email && (
                        <p id="email-error" className="mt-2 text-xs text-terracotta">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={values.phone}
                        onChange={update('phone')}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        placeholder="+254 ..."
                        className={cn(fieldClass, errors.phone && 'border-terracotta')}
                      />
                      {errors.phone && (
                        <p id="phone-error" className="mt-2 text-xs text-terracotta">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="eventType" className={labelClass}>
                        Type of enquiry <span aria-hidden="true">*</span>
                      </label>
                      <div className="relative">
                        <select
                          id="eventType"
                          name="eventType"
                          value={values.eventType}
                          onChange={update('eventType')}
                          aria-invalid={Boolean(errors.eventType)}
                          aria-describedby={errors.eventType ? 'eventType-error' : undefined}
                          className={cn(
                            fieldClass,
                            'appearance-none pr-8',
                            errors.eventType && 'border-terracotta',
                          )}
                          required
                        >
                          <option value="">Select an option</option>
                          {bookingEventTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-ink/40"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </div>
                      {errors.eventType && (
                        <p id="eventType-error" className="mt-2 text-xs text-terracotta">
                          {errors.eventType}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="eventDate" className={labelClass}>
                        Event date
                      </label>
                      <input
                        id="eventDate"
                        name="eventDate"
                        type="date"
                        min={today}
                        value={values.eventDate}
                        onChange={update('eventDate')}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className={labelClass}>
                        Event location
                      </label>
                      <input
                        id="location"
                        name="location"
                        type="text"
                        value={values.location}
                        onChange={update('location')}
                        placeholder="City or venue"
                        className={fieldClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className={labelClass}>
                      Your message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={values.message}
                      onChange={update('message')}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      placeholder="Tell us about the event, audience and what you have in mind."
                      className={cn(fieldClass, 'resize-y', errors.message && 'border-terracotta')}
                      required
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-2 text-xs text-terracotta">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 border-t border-ink/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-xs leading-relaxed text-ink/40">
                      Your details are only used to respond to this enquiry.
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-[0.64rem] uppercase tracking-[0.2em] text-ivory transition-colors hover:bg-brand hover:text-ink"
                    >
                      Prepare email
                      <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-ink/15 pt-8">
                <p className="eyebrow text-terracotta">Direct contact</p>
                <h2 className="mt-3 font-display text-3xl leading-tight">Reach us directly</h2>

                <div className="mt-8 space-y-6">
                  <a href={`mailto:${site.email}`} className="group flex items-start gap-4">
                    <Mail className="mt-1 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                    <span>
                      <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        Email
                      </span>
                      <span className="mt-1 block break-all text-sm text-ink/70 transition-colors group-hover:text-terracotta">
                        {site.email}
                      </span>
                    </span>
                  </a>

                  <a href={site.phoneHref} className="group flex items-start gap-4">
                    <Phone className="mt-1 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                    <span>
                      <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        Phone
                      </span>
                      <span className="mt-1 block text-sm text-ink/70 transition-colors group-hover:text-terracotta">
                        {site.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    href={site.social.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4"
                  >
                    <MessageCircle className="mt-1 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                    <span>
                      <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        WhatsApp
                      </span>
                      <span className="mt-1 block text-sm text-ink/70 transition-colors group-hover:text-terracotta">
                        Start a conversation
                      </span>
                    </span>
                  </a>

                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                    <div>
                      <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        Location
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink/70">
                        {site.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <CalendarDays className="mt-1 size-4 shrink-0 text-terracotta" strokeWidth={1.5} />
                    <div>
                      <span className="block text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                        Founded
                      </span>
                      <span className="mt-1 block text-sm text-ink/70">{site.founded}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 border-t border-ink/15 pt-7">
                  <p className="text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">Follow</p>
                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-ink/60 transition-colors hover:text-terracotta"
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-10 bg-brand-tint/30 p-6">
                  <p className="font-display text-2xl italic leading-tight text-ink/80">
                    “Art from the Heart.”
                  </p>
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.2em] text-ink/40">
                    Walking Shadow Poetry · Nakuru, Kenya
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </PageTransition>
  );
}

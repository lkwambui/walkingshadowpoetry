import { useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/format';
import { subscribeNewsletter } from '../../services/commerce';

interface NewsletterFormProps {
  className?: string;
  tone?: 'light' | 'dark';
  source?: string;
}

export default function NewsletterForm({ className, tone = 'dark', source = 'shop' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    try {
      const result = await subscribeNewsletter(email.trim(), source);
      setStatus('success');
      setMessage(result.message || 'You are on the list.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again shortly.');
    }
  };

  const dark = tone === 'dark';

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== 'idle') setStatus('idle');
            }}
            placeholder="you@example.com"
            autoComplete="email"
            className={cn(
              'w-full border bg-transparent px-5 py-4 text-sm focus:outline-none',
              dark
                ? 'border-ivory/25 text-ivory placeholder:text-ivory/35 focus:border-ivory'
                : 'border-ink/25 text-ink placeholder:text-ink/35 focus:border-ink',
            )}
            required
          />
        </label>
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'inline-flex items-center justify-center gap-3 px-7 py-4 text-[0.62rem] uppercase tracking-[0.2em] transition-colors disabled:opacity-60',
            dark
              ? 'bg-brand text-ink hover:bg-ivory'
              : 'bg-ink text-ivory hover:bg-brand hover:text-ink',
          )}
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
        </button>
      </div>

      {status !== 'idle' && status !== 'loading' && (
        <p
          role="status"
          className={cn(
            'mt-3 flex items-center gap-2 text-xs',
            status === 'success'
              ? dark
                ? 'text-sand'
                : 'text-green-deep'
              : 'text-terracotta',
          )}
        >
          {status === 'success' && <CheckCircle2 className="size-4" strokeWidth={1.5} />}
          {message}
        </p>
      )}
    </form>
  );
}

import type { MouseEventHandler, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/format';

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light' | 'link';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: Variant;
  size?: Size;
  className?: string;
  withArrow?: boolean;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-ink hover:bg-brand-dark hover:text-ink focus-visible:bg-brand-dark border border-brand hover:border-brand-dark',
  dark: 'bg-ink text-ivory hover:bg-brand hover:text-ink border border-ink hover:border-brand',
  outline: 'border border-ink/35 text-ink hover:border-ink hover:bg-ink hover:text-ivory',
  'outline-light':
    'border border-ivory/45 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink',
  link: 'border-b border-current pb-1 text-current hover:text-brand-deep px-0 py-0',
};

const sizes: Record<Size, string> = {
  sm: 'px-5 py-3 text-[0.62rem]',
  md: 'px-6 py-4 text-[0.66rem]',
  lg: 'px-8 py-5 text-[0.7rem]',
};

export default function Button({
  children,
  to,
  href,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  withArrow = true,
  external = false,
  onClick,
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-3 font-medium uppercase tracking-[0.2em] transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    variant !== 'link' && sizes[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {withArrow && (
        <ArrowUpRight
          aria-hidden="true"
          className="size-3.5 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.6}
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

import type { ReactNode } from 'react';
import { cn } from '../../utils/format';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center' | 'between';
  className?: string;
  index?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'light',
  align = 'left',
  className,
  index,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        align === 'between' && 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-4xl', align === 'center' && 'mx-auto')}>
        {(eyebrow || index) && (
          <div
            className={cn(
              'mb-5 flex items-center gap-4',
              align === 'center' && 'justify-center',
            )}
          >
            {index && (
              <span
                className={cn(
                  'font-sans text-[0.62rem] tracking-[0.24em]',
                  tone === 'dark' ? 'text-ivory/45' : 'text-ink/40',
                )}
              >
                {index}
              </span>
            )}
            {eyebrow && (
              <span
                className={cn(
                  'eyebrow',
                  tone === 'dark' ? 'text-sand' : 'text-terracotta',
                )}
              >
                {eyebrow}
              </span>
            )}
          </div>
        )}
        <h2
          className={cn(
            'text-[clamp(2.5rem,6vw,5.6rem)] leading-[0.95]',
            tone === 'dark' ? 'text-ivory' : 'text-ink',
          )}
        >
          {title}
        </h2>
      </div>
      {description && (
        <div
          className={cn(
            'max-w-md text-sm leading-relaxed sm:text-base',
            align === 'between' ? 'md:mb-2 md:text-right' : 'mt-1',
            tone === 'dark' ? 'text-ivory/65' : 'text-ink/65',
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
}

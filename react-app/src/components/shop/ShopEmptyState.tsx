import type { ReactNode } from 'react';
import { cn } from '../../utils/format';

interface ShopEmptyStateProps {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function ShopEmptyState({
  eyebrow = 'Nothing here yet',
  title,
  description,
  action,
  className,
}: ShopEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start border border-ink/15 bg-brand-tint/20 px-7 py-14 sm:px-12 sm:py-16',
        className,
      )}
    >
      <p className="eyebrow text-terracotta">{eyebrow}</p>
      <h3 className="mt-4 max-w-xl font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-tight">
        {title}
      </h3>
      <div className="mt-4 max-w-xl text-sm leading-relaxed text-ink/60">{description}</div>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

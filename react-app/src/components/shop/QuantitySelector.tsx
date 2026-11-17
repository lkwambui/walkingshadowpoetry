import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/format';

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  label = 'Quantity',
}: QuantitySelectorProps) {
  const clamp = (next: number) => Math.max(min, Math.min(max, next));
  const inputId = useId();

  return (
    <div className={cn('inline-flex items-center border border-ink/20', className)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="flex size-11 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="size-3.5" strokeWidth={1.6} />
      </button>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(clamp(Number(event.target.value) || min))}
        className="w-12 border-0 bg-transparent text-center text-sm tabular-nums text-ink focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="flex size-11 items-center justify-center text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="size-3.5" strokeWidth={1.6} />
      </button>
    </div>
  );
}

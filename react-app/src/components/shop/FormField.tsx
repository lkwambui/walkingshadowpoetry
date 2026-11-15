import { ChevronDown } from 'lucide-react';
import type { ReactNode, TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/format';

export const fieldClass =
  'w-full border-0 border-b border-ink/25 bg-transparent py-3 text-sm text-ink placeholder:text-ink/30 focus:border-terracotta focus:outline-none focus:ring-0';
export const labelClass = 'mb-1 block text-[0.55rem] uppercase tracking-[0.2em] text-ink/45';

interface FieldShellProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ label, htmlFor, error, required, hint, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className={labelClass}>
        {label} {required && <span aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-[0.68rem] leading-relaxed text-ink/40">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs text-terracotta">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextField({ label, error, hint, id, required, className, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} required={required} hint={hint}>
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClass, error && 'border-terracotta', className)}
        required={required}
        {...props}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextAreaField({ label, error, hint, id, required, className, ...props }: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} required={required} hint={hint}>
      <textarea
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(fieldClass, 'resize-y', error && 'border-terracotta', className)}
        required={required}
        {...props}
      />
    </FieldShell>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: readonly string[] | { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  error,
  hint,
  id,
  required,
  options,
  placeholder = 'Select an option',
  className,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label;
  return (
    <FieldShell label={label} htmlFor={fieldId} error={error} required={required} hint={hint}>
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(fieldClass, 'appearance-none pr-8', error && 'border-terracotta', className)}
          required={required}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const value = typeof option === 'string' ? option : option.value;
            const text = typeof option === 'string' ? option : option.label;
            return (
              <option key={value} value={value}>
                {text}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-ink/40"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}

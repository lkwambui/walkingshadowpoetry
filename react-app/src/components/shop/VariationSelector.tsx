import { cn } from '../../utils/format';
import type { StoreAttribute } from '../../services/storeApi';
import { attributeLabel, colourHex } from '../../services/productUtils';

interface VariationSelectorProps {
  attributes: StoreAttribute[];
  selection: Record<string, string>;
  onChange: (attributeName: string, value: string) => void;
  className?: string;
}

function isColour(attribute: StoreAttribute) {
  const haystack = `${attribute.name} ${attribute.taxonomy ?? ''}`.toLowerCase();
  return haystack.includes('colour') || haystack.includes('color');
}

export default function VariationSelector({
  attributes,
  selection,
  onChange,
  className,
}: VariationSelectorProps) {
  const usable = attributes.filter((attribute) => attribute.terms.length > 0);
  if (usable.length === 0) return null;

  return (
    <div className={cn('space-y-7', className)}>
      {usable.map((attribute) => {
        const colour = isColour(attribute);
        const selected = selection[attribute.name];

        return (
          <fieldset key={attribute.id || attribute.name}>
            <legend className="flex w-full items-baseline justify-between gap-4">
              <span className="text-[0.58rem] uppercase tracking-[0.22em] text-ink/50">
                {attributeLabel(attribute.name)}
              </span>
              {selected && (
                <span className="text-[0.58rem] uppercase tracking-[0.18em] text-ink/40">
                  {selected}
                </span>
              )}
            </legend>

            <div className={cn('mt-3 flex flex-wrap gap-2', colour && 'gap-3')}>
              {attribute.terms.map((term) => {
                const isSelected = selected === term.slug || selected === term.name;
                return (
                  <button
                    key={term.id || term.slug}
                    type="button"
                    onClick={() => onChange(attribute.name, term.slug)}
                    aria-pressed={isSelected}
                    title={term.name}
                    className={cn(
                      'transition-all duration-200',
                      colour
                        ? 'size-8 rounded-full border-2'
                        : 'min-w-11 border px-3 py-2.5 text-[0.62rem] uppercase tracking-[0.16em]',
                      colour
                        ? isSelected
                          ? 'border-ink ring-1 ring-ink ring-offset-2 ring-offset-ivory'
                          : 'border-ink/20 hover:border-ink/50'
                        : isSelected
                          ? 'border-ink bg-ink text-ivory'
                          : 'border-ink/20 text-ink/70 hover:border-ink hover:text-ink',
                    )}
                    style={colour ? { backgroundColor: colourHex(term.name) } : undefined}
                  >
                    {!colour && term.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

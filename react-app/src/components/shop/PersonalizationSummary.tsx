import { useState } from 'react';
import { cn } from '../../utils/format';
import type { StoreCartItem } from '../../services/storeApi';

type ItemDataEntry = StoreCartItem['item_data'][number];

const priorityKeys = [
  'recipient',
  'recipient_name',
  'recipientName',
  'occasion',
  'message',
  'tone',
  'poetic_style',
  'length',
  'delivery',
  'delivery_format',
  'deliveryFormat',
  'preferred_date',
];

function entryKey(entry: ItemDataEntry) {
  return entry.raw_key || entry.key;
}

export default function PersonalizationSummary({
  entries,
  compact = false,
}: {
  entries: ItemDataEntry[];
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  if (entries.length === 0) return null;

  const priority = entries.filter((entry) => priorityKeys.includes(entryKey(entry)));
  const visible = expanded ? entries : priority.length > 0 ? priority.slice(0, compact ? 3 : 5) : entries.slice(0, compact ? 3 : 5);
  const hasMore = entries.length > visible.length;

  return (
    <div className="mt-3 border-l border-terracotta/40 pl-3">
      <p className="text-[0.55rem] uppercase tracking-[0.18em] text-terracotta">Personalization</p>
      <ul className="mt-1.5 space-y-1">
        {visible.map((entry, index) => (
          <li key={`${entryKey(entry)}-${index}`} className="text-xs leading-relaxed text-ink/60">
            {entry.display || entry.value}
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={cn(
            'mt-2 text-[0.58rem] uppercase tracking-[0.16em] text-ink/50 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-terracotta',
          )}
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : `View all ${entries.length} details`}
        </button>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryItem } from '../../data/gallery';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import ImageWithFallback from '../common/ImageWithFallback';

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const item = items[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  useLockBodyScroll(true);

  const previous = useCallback(() => {
    onChange((index - 1 + items.length) % items.length);
  }, [index, items.length, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % items.length);
  }, [index, items.length, onChange]);

  useEffect(() => {
    restoreFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => {
      restoreFocus.current?.focus();
    };
  }, []);

  useEffect(() => {
    const before = items[(index - 1 + items.length) % items.length];
    const after = items[(index + 1) % items.length];
    [before, after].forEach((neighbor) => {
      const image = new Image();
      image.src = neighbor.src;
    });
  }, [index, items]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        previous();
        return;
      }
      if (event.key === 'ArrowRight') {
        next();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [next, onClose, previous]);

  if (!item) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] flex flex-col bg-ink/95 text-ivory backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Gallery image: ${item.title}`}
        className="flex h-full flex-col"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <p className="text-[0.58rem] uppercase tracking-[0.2em] text-ivory/50">
            <span className="text-sand">{String(index + 1).padStart(2, '0')}</span>
            <span className="mx-2">/</span>
            {String(items.length).padStart(2, '0')}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
            aria-label="Close gallery"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
          <button
            type="button"
            onClick={previous}
            className="absolute left-2 z-10 flex size-11 items-center justify-center border border-ivory/20 bg-ink/40 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory sm:left-6 sm:size-14"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" strokeWidth={1.5} />
          </button>

          <ImageWithFallback
            key={item.id}
            src={item.src}
            alt={item.alt}
            className="max-h-[70vh] w-auto max-w-full object-contain"
            width={item.width}
            height={item.height}
            loading="eager"
          />

          <button
            type="button"
            onClick={next}
            className="absolute right-2 z-10 flex size-11 items-center justify-center border border-ivory/20 bg-ink/40 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory sm:right-6 sm:size-14"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-5 py-6 text-center sm:px-8 sm:py-8">
          <p className="text-[0.52rem] uppercase tracking-[0.2em] text-sand">{item.category}</p>
          <p className="mt-2 font-display text-2xl leading-tight sm:text-3xl">{item.title}</p>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-relaxed text-ivory/55">
            {item.caption}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

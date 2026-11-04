import type { GalleryItem } from '../../data/gallery';
import ImageWithFallback from '../common/ImageWithFallback';

interface MasonryGalleryProps {
  items: GalleryItem[];
  onSelect: (index: number) => void;
}

export default function MasonryGallery({ items, onSelect }: MasonryGalleryProps) {
  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item, index) => (
        <div key={item.id} className="mb-4 break-inside-avoid">
          <button
            type="button"
            onClick={() => onSelect(index)}
            className="group relative block w-full overflow-hidden bg-ink/5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta"
            aria-label={`Open image: ${item.title} — ${item.caption}`}
          >
            <span
              className="relative block w-full overflow-hidden"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <ImageWithFallback
                src={item.src}
                alt={item.alt}
                className="image-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                width={item.width}
                height={item.height}
              />
            </span>
            <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/25" />
            <span className="absolute inset-x-0 bottom-0 translate-y-3 bg-ink/85 px-4 py-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="block text-[0.5rem] uppercase tracking-[0.2em] text-sand">
                {item.category}
              </span>
              <span className="mt-1 block font-display text-xl leading-tight text-ivory">
                {item.title}
              </span>
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}

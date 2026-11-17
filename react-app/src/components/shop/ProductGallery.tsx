import { useEffect, useState } from 'react';
import { cn } from '../../utils/format';
import type { StoreImage } from '../../services/storeApi';
import ImageWithFallback from '../common/ImageWithFallback';

interface ProductGalleryProps {
  images: StoreImage[];
  productName: string;
  compact?: boolean;
}

export default function ProductGallery({ images, productName, compact = false }: ProductGalleryProps) {
  const gallery = images.length
    ? images
    : [
        {
          id: 0,
          src: '/media/shop/shop-poster.webp',
          thumbnail: '',
          srcset: '',
          sizes: '',
          name: productName,
          alt: productName,
        },
      ];
  const [active, setActive] = useState(0);
  const current = gallery[Math.min(active, gallery.length - 1)];

  useEffect(() => setActive(0), [images]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink/5">
        <ImageWithFallback
          key={current.id}
          src={current.src}
          alt={current.alt || productName}
          className="image-cover"
          width={1000}
          height={1250}
          loading="eager"
          srcSet={current.srcset}
          sizes={current.sizes}
        />
      </div>

      {gallery.length > 1 && (
        <div
          className={cn('grid gap-3', compact ? 'grid-cols-4' : 'grid-cols-4 sm:grid-cols-5')}
          role="tablist"
          aria-label={`${productName} images`}
        >
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`View image ${index + 1} of ${gallery.length}`}
              onClick={() => setActive(index)}
              className={cn(
                'aspect-square overflow-hidden bg-ink/5 transition-opacity',
                index === active ? 'opacity-100 ring-1 ring-ink' : 'opacity-60 hover:opacity-100',
              )}
            >
              <ImageWithFallback
                src={image.thumbnail || image.src}
                alt=""
                className="image-cover"
                width={200}
                height={200}
                srcSet={image.thumbnail_srcset || image.srcset}
                sizes={compact ? '120px' : '160px'}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

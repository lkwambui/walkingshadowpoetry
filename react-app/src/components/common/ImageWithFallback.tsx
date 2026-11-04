import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '../../utils/format';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  src: string;
  alt: string;
  fallbackClassName?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  loading = 'lazy',
  decoding = 'async',
  onLoad,
  ...props
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'flex items-center justify-center bg-brown px-6 text-center text-ivory/60',
          className,
          fallbackClassName,
        )}
      >
        <span className="font-display text-2xl italic">Walking Shadow</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'transition-opacity duration-700',
        loaded ? 'opacity-100' : 'opacity-0',
        className,
      )}
      loading={loading}
      decoding={decoding}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}

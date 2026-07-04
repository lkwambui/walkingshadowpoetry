import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Close } from '../components/ui/Icons';
import SEO from '../components/seo/SEO';
import { galleryItems, type GalleryItem } from '../data/content';

const categories = [
  { key: 'all', label: 'The Galore' },
  { key: 'awards', label: 'Awards' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'collections', label: 'Collections' },
  { key: 'artist', label: 'Artist' },
] as const;

type CatKey = (typeof categories)[number]['key'];

export default function Gallery() {
  const [active, setActive] = useState<CatKey>('all');
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const filtered = active === 'all' ? galleryItems : galleryItems.filter(g => g.category === active);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    if (!lightbox) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightbox, closeLightbox]);

  useEffect(() => {
    if (lightbox) {
      const el = document.querySelector('[data-lightbox-close]') as HTMLElement | null;
      el?.focus();
    }
  }, [lightbox]);

  return (
    <>
      <SEO
        title="Gallery"
        description="Explore the gallery of Walking Shadow Poetry - awards, campaigns, collections, and artist photos. Art from the Heart."
        canonical="https://walkingshadowpoetry.com/gallery"
      />

      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-gray-900), #1a1a2e)',
          padding: '80px 0 64px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
            opacity: 0.1,
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'var(--color-white)', marginBottom: 8 }}>Gallery</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.95rem' }}>
            <Link to="/" style={{ color: 'var(--color-gray-300)' }}>Home</Link>
            <span style={{ color: 'var(--color-gray-500)' }}>-</span>
            <span style={{ color: 'var(--color-primary)' }}>Gallery</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 8,
              flexWrap: 'wrap',
              marginBottom: 40,
            }}
          >
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActive(cat.key)}
                aria-pressed={active === cat.key}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 150ms',
                  background: active === cat.key ? 'var(--color-primary)' : 'var(--color-gray-50)',
                  color: active === cat.key ? 'var(--color-white)' : 'var(--color-gray-600)',
                  minHeight: 44,
                }}
                onMouseEnter={e => {
                  if (active !== cat.key) {
                    e.currentTarget.style.background = 'var(--color-gray-100)';
                  }
                }}
                onMouseLeave={e => {
                  if (active !== cat.key) {
                    e.currentTarget.style.background = 'var(--color-gray-50)';
                  }
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 48 }}>
              No images found in this category.
            </p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 16,
              }}
            >
              {filtered.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(item)}
                  aria-label={`View ${item.title || 'image'}`}
                  style={{
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    aspectRatio: item.category === 'artist' ? '3/4' : '4/3',
                    background: 'var(--color-gray-100)',
                    minHeight: 200,
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.title || 'Gallery image'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 300ms',
                    }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                      opacity: 0,
                      transition: 'opacity 200ms',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: 16,
                    }}
                    className="gallery-overlay-item"
                  >
                    <div style={{ textAlign: 'left', width: '100%' }}>
                      {item.title && (
                        <h4 style={{ color: 'var(--color-white)', margin: 0, fontSize: '1rem' }}>{item.title}</h4>
                      )}
                      {item.caption && (
                        <p style={{ color: 'var(--color-gray-200)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            cursor: 'pointer',
          }}
          onClick={closeLightbox}
        >
          <button
            data-lightbox-close
            onClick={closeLightbox}
            aria-label="Close lightbox"
            style={{
              position: 'absolute',
              top: 20,
              right: 24,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              color: 'var(--color-white)',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: 8,
              lineHeight: 1,
            }}
          >
            <Close size={20} color="var(--color-white)" />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.title || 'Gallery image'}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 8,
            }}
            onClick={e => e.stopPropagation()}
          />
          {(lightbox.title || lightbox.caption) && (
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                color: 'var(--color-white)',
                padding: '12px 24px',
                borderRadius: 8,
                textAlign: 'center',
                maxWidth: '80vw',
              }}
            >
              {lightbox.title && <h4 style={{ color: 'var(--color-white)', margin: 0 }}>{lightbox.title}</h4>}
              {lightbox.caption && <p style={{ color: 'var(--color-gray-200)', margin: 0, fontSize: '0.9rem' }}>{lightbox.caption}</p>}
            </div>
          )}
        </div>
      )}

      <style>{`
        .gallery-overlay-item { opacity: 0; }
        button:hover .gallery-overlay-item { opacity: 1; }
        button:hover img { transform: scale(1.05); }
        button:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
      `}</style>
    </>
  );
}

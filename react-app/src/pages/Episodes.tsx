import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { ImageSkeleton } from '../components/ui/Skeleton';
import { fetchPosts, formatDate, stripHtml, getCategories, type WPPost } from '../data/api';

const PER_PAGE = 10;

export default function Episodes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1);
  const searchQuery = searchParams.get('search') || '';

  const [posts, setPosts] = useState<WPPost[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState(searchQuery);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    fetchPosts(currentPage, PER_PAGE, searchQuery)
      .then(({ posts: data, total: t, totalPages: pages }) => {
        if (!cancelled) {
          setPosts(data);
          setTotal(t);
          setTotalPages(pages);
        }
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load episodes.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [currentPage, searchQuery]);

  const updateParams = useCallback((page: number, search: string) => {
    const params: Record<string, string> = {};
    if (page > 1) params.page = String(page);
    if (search) params.search = search;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  const goToPage = useCallback((page: number) => {
    updateParams(page, searchQuery);
  }, [updateParams, searchQuery]);

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      updateParams(1, value.trim());
    }, 350);
  };

  return (
    <>
      <SEO
        title={
          searchQuery
            ? `Search: "${searchQuery}"${currentPage > 1 ? ` - Page ${currentPage}` : ''}`
            : currentPage > 1 ? `Episodes - Page ${currentPage}` : 'Episodes'
        }
        description={searchQuery ? `Search results for "${searchQuery}" on Walking Shadow Poetry.` : 'Browse poetry and spoken word episodes from Walking Shadow Poetry.'}
        canonical={`https://walkingshadowpoetry.com/episodes${currentPage > 1 ? `?page=${currentPage}` : ''}`}
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
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'var(--color-white)', marginBottom: 8 }}>Episodes</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, fontSize: '0.95rem', marginBottom: 28 }}>
            <Link to="/" style={{ color: 'var(--color-gray-300)' }}>Home</Link>
            <span style={{ color: 'var(--color-gray-500)' }}>-</span>
            <span style={{ color: 'var(--color-primary)' }}>Episodes</span>
          </div>

          {/* Search */}
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--color-white)',
                borderRadius: 10,
                padding: '0 16px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-400)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search episodes..."
                value={searchInput}
                onChange={e => handleSearchInput(e.target.value)}
                aria-label="Search episodes"
                style={{
                  width: '100%',
                  padding: '14px 12px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-text)',
                  outline: 'none',
                }}
              />
              {searchInput && (
                <button
                  onClick={() => { setSearchInput(''); updateParams(1, ''); }}
                  aria-label="Clear search"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-gray-400)', fontSize: '1.2rem', lineHeight: 1 }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="episodes-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="episode-card">
                  <ImageSkeleton aspectRatio="4/3" />
                  <div style={{ padding: '24px' }}>
                    <div style={{ height: 14, width: '30%', borderRadius: 6, background: 'var(--color-gray-100)', marginBottom: 16 }} />
                    <div style={{ height: 24, width: '70%', borderRadius: 6, background: 'var(--color-gray-100)', marginBottom: 12 }} />
                    <div style={{ height: 14, borderRadius: 6, background: 'var(--color-gray-100)', marginBottom: 8 }} />
                    <div style={{ height: 14, borderRadius: 6, background: 'var(--color-gray-100)', marginBottom: 8 }} />
                    <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'var(--color-gray-100)' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <p style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: 48 }}>{error}</p>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 48 }}>
              <p style={{ color: 'var(--color-text-light)', marginBottom: 16 }}>
                {searchQuery ? `No episodes match "${searchQuery}".` : 'No episodes found.'}
              </p>
              {searchQuery && (
                <button className="btn btn-outline btn-sm" onClick={() => { setSearchInput(''); updateParams(1, ''); }}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Result count */}
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-light)', marginBottom: 20 }}>
                {searchQuery
                  ? `Found ${total} episode${total !== 1 ? 's' : ''} matching "${searchQuery}"`
                  : `Showing ${posts.length} of ${total} episode${total !== 1 ? 's' : ''}`
                }
              </p>

              <div className="episodes-list">
                {posts.map(post => {
                  const img = post.jetpack_featured_media_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
                  const categories = getCategories(post);
                  return (
                    <article key={post.id} className="episode-card">
                      <Link to={`/episodes/${post.slug}`} className="episode-image-link">
                        {img ? (
                          <img
                            src={img}
                            alt={post.title.rendered}
                            className="episode-image"
                            loading="lazy"
                          />
                        ) : (
                          <div className="episode-image-fallback">WSP</div>
                        )}
                      </Link>
                      <div className="episode-body">
                        {/* Categories */}
                        {categories.length > 0 && (
                          <div className="episode-categories">
                            {categories.slice(0, 3).map(cat => (
                              <span key={cat} className="episode-category">{cat}</span>
                            ))}
                          </div>
                        )}
                        <h3 className="episode-title">
                          <Link to={`/episodes/${post.slug}`}>{post.title.rendered}</Link>
                        </h3>
                        <p className="episode-date">{formatDate(post.date)}</p>
                        <p className="episode-excerpt">
                          {stripHtml(post.excerpt.rendered).substring(0, 250)}...
                        </p>
                        <Link to={`/episodes/${post.slug}`} className="btn btn-primary btn-sm">
                          Read More
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav aria-label="Episodes pagination" className="pagination-nav">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => goToPage(currentPage - 1)}
                    aria-label="Previous page"
                    className="pagination-btn"
                  >
                    &larr; Prev
                  </button>

                  {generatePageNumbers(currentPage, totalPages).map((p, i) =>
                    p === '...' ? (
                      <span key={`dots-${i}`} className="pagination-dots">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p as number)}
                        aria-current={currentPage === p ? 'page' : undefined}
                        className={`pagination-btn${currentPage === p ? ' pagination-active' : ''}`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => goToPage(currentPage + 1)}
                    aria-label="Next page"
                    className="pagination-btn"
                  >
                    Next &rarr;
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <style>{`
        /* Card grid */
        .episodes-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .episode-card {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
          background: var(--color-white);
          transition: box-shadow 200ms, transform 200ms;
        }
        .episode-card:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-4px);
        }

        .episode-image-link {
          display: block;
          overflow: hidden;
          aspect-ratio: 16 / 11;
        }
        .episode-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 300ms;
        }
        .episode-card:hover .episode-image { transform: scale(1.05); }
        .episode-image-fallback {
          width: 100%;
          height: 100%;
          background: var(--color-primary-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          font-weight: 600;
        }

        .episode-body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .episode-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 10px;
        }
        .episode-category {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          background: var(--color-primary-bg);
          color: var(--color-primary-dark);
        }

        .episode-title {
          margin-bottom: 8px;
          font-size: 1.1rem;
        }
        .episode-title a {
          color: inherit;
          text-decoration: none;
        }
        .episode-title a:hover { color: var(--color-primary); }

        .episode-date {
          font-size: 0.8rem;
          color: var(--color-gray-400);
          margin-bottom: 10px;
        }
        .episode-excerpt {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--color-text);
          flex: 1;
        }

        .pagination-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-top: 48px;
          flex-wrap: wrap;
        }
        .pagination-btn {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 150ms;
          min-width: 44px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-50);
          color: var(--color-gray-600);
        }
        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .pagination-btn:not(:disabled):hover {
          background: var(--color-gray-100);
        }
        .pagination-active {
          background: var(--color-primary) !important;
          color: var(--color-white) !important;
          font-weight: 700;
        }
        .pagination-dots {
          color: var(--color-gray-400);
          padding: 0 4px;
        }

        /* Tablet: 2 columns */
        @media (max-width: 1024px) {
          .episodes-list {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Mobile: 1 column */
        @media (max-width: 640px) {
          .episodes-list {
            grid-template-columns: 1fr;
          }
          .episode-body { padding: 16px; }
          .pagination-nav { gap: 4px; }
          .pagination-btn {
            padding: 8px 12px;
            min-width: 38px;
            min-height: 38px;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}

function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '...')[] = [];
  pages.push(1);

  if (current > 3) pages.push('...');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('...');

  pages.push(total);

  return pages;
}

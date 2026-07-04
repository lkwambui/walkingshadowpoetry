import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';
import { fetchPost, formatDate, stripHtml, type WPPost } from '../data/api';

export default function Episode() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WPPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    fetchPost(slug)
      .then(data => { if (!cancelled) setPost(data); })
      .catch(() => { if (!cancelled) setError('Failed to load episode.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--color-gray-200)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 12 }}>Episode not found</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 24 }}>{error || 'The episode you\'re looking for doesn\'t exist.'}</p>
        <Link to="/episodes" className="btn btn-primary">Back to Episodes</Link>
      </div>
    );
  }

  const img = post.jetpack_featured_media_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <>
      <SEO
        title={post.title.rendered}
        description={stripHtml(post.excerpt.rendered).substring(0, 160)}
        canonical={`https://walkingshadowpoetry.com/episodes/${post.slug}`}
        ogImage={img || '/images/logo.png'}
        ogType="article"
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 760 }}>
          {img && (
            <img
              src={img}
              alt={post.title.rendered}
              style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 16, marginBottom: 32, boxShadow: 'var(--shadow-lg)' }}
              loading="eager"
            />
          )}
          <div style={{ marginBottom: 24 }}>
            <Link to="/episodes" style={{ color: 'var(--color-text-light)', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              &larr; Back to Episodes
            </Link>
          </div>
          <h1 style={{ marginBottom: 12 }}>{post.title.rendered}</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gray-400)', marginBottom: 32 }}>
            {formatDate(post.date)}
          </p>
          <div
            style={{ fontSize: '1.05rem', lineHeight: 1.9 }}
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--color-border)' }}>
            <Link to="/episodes" className="btn btn-outline">&larr; All Episodes</Link>
          </div>
        </div>
      </section>
    </>
  );
}

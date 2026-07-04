import { Link } from 'react-router-dom';
import SEO from '../components/seo/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist." />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          padding: 48,
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(5rem, 15vw, 10rem)',
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-primary)',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          404
        </h1>
        <h2 style={{ marginBottom: 12 }}>Page Not Found</h2>
        <p style={{ color: 'var(--color-text-light)', marginBottom: 32, maxWidth: 400 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}

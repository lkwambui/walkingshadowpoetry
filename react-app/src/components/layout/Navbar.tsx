import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/content';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <nav
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 72,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img
            src="/images/logo.png"
            alt="Walking Shadow Poetry logo"
            style={{ height: 44, width: 'auto' }}
            width={44}
            height={44}
            loading="eager"
          />
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.15rem',
              fontWeight: 700,
              color: 'var(--color-heading)',
              display: 'none',
            }}
            className="brand-text"
          >
            Walking Shadow Poetry
          </span>
        </Link>

        {/* Desktop nav */}
        <ul
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          className="desktop-nav"
        >
            {navLinks.map(link =>
            link.external ? (
              <li key={link.label}>
                <a
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={navLinkStyle}
                >
                  {link.label}
                </a>
              </li>
            ) : (
              <li key={link.label}>
                <Link
                  to={link.path}
                  aria-current={pathname === link.path ? 'page' : undefined}
                  style={{
                    ...navLinkStyle,
                    ...(pathname === link.path ? activeStyle : {}),
                  }}
                >
                  {link.label}
                </Link>
              </li>
            )
          )}
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            color: 'var(--color-gray-700)',
          }}
          className="hamburger"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 72,
            left: 0,
            right: 0,
            background: 'var(--color-white)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-lg)',
            padding: '16px 24px',
            zIndex: 999,
          }}
          className="mobile-menu"
        >
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link =>
              link.external ? (
                <li key={link.label}>
                  <a
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    style={mobileLinkStyle}
                  >
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    onClick={() => setOpen(false)}
                    style={{
                      ...mobileLinkStyle,
                      ...(pathname === link.path ? { color: 'var(--color-primary)' } : {}),
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
          .brand-text { display: block !important; }
        }
      `}</style>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '8px 16px',
  borderRadius: 6,
  color: 'var(--color-gray-600)',
  fontWeight: 500,
  fontSize: '0.925rem',
  textDecoration: 'none',
  transition: 'color 150ms, background 150ms',
};

const activeStyle: React.CSSProperties = {
  color: 'var(--color-primary)',
  background: 'var(--color-primary-bg)',
};

const mobileLinkStyle: React.CSSProperties = {
  display: 'block',
  padding: '12px 16px',
  borderRadius: 8,
  color: 'var(--color-gray-700)',
  fontWeight: 500,
  fontSize: '1rem',
  textDecoration: 'none',
};

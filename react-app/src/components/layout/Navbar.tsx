import { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/site';
import { cn } from '../../utils/format';
import Button from '../common/Button';
import MobileMenu from './MobileMenu';
import Wordmark from './Wordmark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const solid = scrolled || menuOpen;
  const tone = solid ? 'ink' : 'ivory';

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[70] transition-all duration-500',
          solid
            ? 'border-b border-ink/10 bg-ivory/95 text-ink backdrop-blur-md'
            : 'border-b border-transparent bg-transparent text-ivory',
        )}
      >
        <div className="shell-wide flex h-[4.5rem] items-center justify-between gap-6 lg:h-[5.25rem]">
          <Wordmark tone={tone} />

          <nav aria-label="Main" className="hidden items-center gap-5 xl:flex 2xl:gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-200',
                    solid
                      ? isActive
                        ? 'text-terracotta'
                        : 'text-ink/65 hover:text-ink'
                      : isActive
                        ? 'text-sand'
                        : 'text-ivory/70 hover:text-ivory',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              to="/contact"
              variant={solid ? 'dark' : 'outline-light'}
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book a performance
            </Button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className={cn(
                'flex size-11 items-center justify-center border transition-colors xl:hidden',
                solid
                  ? 'border-ink/20 text-ink hover:bg-ink hover:text-ivory'
                  : 'border-ivory/30 text-ivory hover:bg-ivory hover:text-ink',
              )}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              <Menu className="size-5" strokeWidth={1.4} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={toggleRef} />
    </>
  );
}

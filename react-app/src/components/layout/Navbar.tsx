import { useEffect, useRef, useState } from 'react';
import { Menu, ShoppingBag } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { navLinks } from '../../data/site';
import { cn } from '../../utils/format';
import { useCart } from '../../hooks/useCart';
import { useShopUi } from '../../context/ShopUiProvider';
import Button from '../common/Button';
import MobileMenu from './MobileMenu';
import Wordmark from './Wordmark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { itemCount } = useCart();
  const { openCart } = useShopUi();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const path = location.pathname;
  const isShop = path === '/shop' || path.startsWith('/shop/');
  const shopHasDarkHero =
    path === '/shop' || path === '/shop/personalized' || path === '/shop/commissions';
  const solid = scrolled || menuOpen || (isShop && !shopHasDarkHero);
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
            <button
              type="button"
              onClick={openCart}
              className={cn(
                'relative flex size-11 items-center justify-center border transition-colors',
                solid
                  ? 'border-ink/20 text-ink hover:bg-ink hover:text-ivory'
                  : 'border-ivory/30 text-ivory hover:bg-ivory hover:text-ink',
              )}
              aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="size-5" strokeWidth={1.4} />
              {itemCount > 0 && (
                <span
                  className={cn(
                    'absolute -right-1.5 -top-1.5 flex min-w-[1.15rem] items-center justify-center px-1 text-[0.55rem] font-medium tabular-nums',
                    solid ? 'bg-terracotta text-ivory' : 'bg-brand text-ink',
                  )}
                >
                  {itemCount}
                </span>
              )}
            </button>
            <Button
              to="/contact"
              variant={solid ? 'dark' : 'outline-light'}
              size="sm"
              className="hidden lg:inline-flex"
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

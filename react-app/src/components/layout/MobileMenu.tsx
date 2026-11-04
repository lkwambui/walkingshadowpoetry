import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { navLinks, site, socialLinks } from '../../data/site';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cn } from '../../utils/format';
import Wordmark from './Wordmark';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

export default function MobileMenu({ open, onClose, returnFocusRef }: MobileMenuProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-ink text-ivory"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? undefined : { opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="shell flex items-center justify-between py-6">
            <Wordmark tone="ivory" onClick={onClose} />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="flex size-11 items-center justify-center border border-ivory/30 text-ivory transition-colors hover:border-ivory hover:bg-ivory hover:text-ink"
              aria-label="Close menu"
            >
              <X className="size-5" strokeWidth={1.4} />
            </button>
          </div>

          <nav className="shell flex flex-1 flex-col justify-center py-10" aria-label="Mobile">
            <ul className="divide-y divide-ivory/10 border-y border-ivory/10">
              {navLinks.map((link, index) => (
                <li key={link.path}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'group flex items-baseline gap-5 py-4 transition-colors',
                        isActive ? 'text-sand' : 'text-ivory hover:text-sand',
                      )
                    }
                  >
                    <span className="w-6 text-[0.58rem] tracking-[0.2em] text-ivory/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-[clamp(2rem,9vw,3.5rem)] leading-none">
                      {link.label}
                    </span>
                    <ArrowUpRight className="ml-auto size-4 opacity-0 transition-opacity group-hover:opacity-60" />
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col gap-6">
              <Link
                to="/contact"
                onClick={onClose}
                className="inline-flex w-fit items-center gap-3 bg-brand px-6 py-4 text-[0.66rem] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ivory hover:text-ink"
              >
                Book a performance
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
              </Link>

              <div className="grid gap-2 text-xs text-ivory/60 sm:grid-cols-2">
                <a href={`mailto:${site.email}`} className="link-underline w-fit">
                  {site.email}
                </a>
                <a href={site.phoneHref} className="link-underline w-fit">
                  {site.phone}
                </a>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.6rem] uppercase tracking-[0.2em] text-ivory/50 transition-colors hover:text-ivory"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

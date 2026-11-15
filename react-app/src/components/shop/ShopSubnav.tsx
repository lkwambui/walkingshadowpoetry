import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/format';
import Container from '../common/Container';

const links = [
  { label: 'Shop', to: '/shop', end: true },
  { label: 'Clothing', to: '/shop/clothing' },
  { label: 'Personalized Pieces', to: '/shop/personalized' },
  { label: 'Commissions', to: '/shop/commissions' },
  { label: 'Cart', to: '/shop/cart' },
];

export default function ShopSubnav() {
  return (
    <div className="sticky top-[4.5rem] z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-md lg:top-[5.25rem]">
      <Container wide>
        <nav aria-label="Shop" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto py-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap px-3.5 py-2 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
                  isActive ? 'text-terracotta' : 'text-ink/55 hover:text-ink',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </Container>
    </div>
  );
}

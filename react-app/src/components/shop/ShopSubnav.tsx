import { NavLink } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { cn } from '../../utils/format';
import Container from '../common/Container';
import { useCart } from '../../hooks/useCart';
import { useShopUi } from '../../context/ShopUiProvider';
import { useWishlist } from '../../hooks/useWishlist';

const links = [
  { label: 'Shop', to: '/shop', end: true },
  { label: 'Clothing', to: '/shop/clothing' },
  { label: 'Personalized Pieces', to: '/shop/personalized' },
  { label: 'Commissions', to: '/shop/commissions' },
];

export default function ShopSubnav() {
  const { itemCount } = useCart();
  const { openCart } = useShopUi();
  const wishlist = useWishlist();

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
          <NavLink
            to="/shop/wishlist"
            className={({ isActive }) =>
              cn(
                'ml-auto inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-[0.58rem] uppercase tracking-[0.18em] transition-colors',
                isActive ? 'text-terracotta' : 'text-ink/55 hover:text-ink',
              )
            }
          >
            <Heart className="size-3.5" strokeWidth={1.6} />
            Wishlist
            {wishlist.count > 0 && <span className="tabular-nums">({wishlist.count})</span>}
          </NavLink>
          <button
            type="button"
            onClick={openCart}
            className="inline-flex items-center gap-2 whitespace-nowrap px-3.5 py-2 text-[0.58rem] uppercase tracking-[0.18em] text-ink/55 transition-colors hover:text-ink"
            aria-label={`Open cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag className="size-3.5" strokeWidth={1.6} />
            Cart
            {itemCount > 0 && <span className="tabular-nums">({itemCount})</span>}
          </button>
        </nav>
      </Container>
    </div>
  );
}

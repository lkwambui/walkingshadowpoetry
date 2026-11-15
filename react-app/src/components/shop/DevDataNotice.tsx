import { useCart } from '../../hooks/useCart';

/**
 * Renders a visible notice whenever the storefront is running against the
 * development mock catalogue. This guarantees mock data is never silently
 * presented as live WooCommerce data.
 */
export default function DevDataNotice() {
  const { isMock } = useCart();
  if (!isMock) return null;

  return (
    <div className="border-b border-terracotta/30 bg-terracotta/10 px-4 py-2.5 text-center text-[0.6rem] uppercase tracking-[0.2em] text-terracotta">
      Development data — WooCommerce catalogue is not connected
    </div>
  );
}

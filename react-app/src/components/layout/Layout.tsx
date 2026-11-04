import { Outlet } from 'react-router-dom';
import ScrollToTop from '../ui/ScrollToTop';
import Footer from './Footer';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-ivory">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-[150%] bg-ink px-5 py-3 text-[0.65rem] uppercase tracking-[0.2em] text-ivory transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

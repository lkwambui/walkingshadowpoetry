import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Poetry = lazy(() => import('./pages/Poetry'));
const PoemDetail = lazy(() => import('./pages/PoemDetail'));
const Episodes = lazy(() => import('./pages/Episodes'));
const WordPressPostDetail = lazy(() => import('./pages/WordPressPostDetail'));
const Performances = lazy(() => import('./pages/Performances'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Journal = lazy(() => import('./pages/Journal'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ShopHome = lazy(() => import('./pages/shop/ShopHome'));
const Clothing = lazy(() => import('./pages/shop/Clothing'));
const Category = lazy(() => import('./pages/shop/Category'));
const Search = lazy(() => import('./pages/shop/Search'));
const ProductDetail = lazy(() => import('./pages/shop/ProductDetail'));
const Personalized = lazy(() => import('./pages/shop/Personalized'));
const CustomizedNote = lazy(() => import('./pages/shop/CustomizedNote'));
const Commissions = lazy(() => import('./pages/shop/Commissions'));
const Cart = lazy(() => import('./pages/shop/Cart'));
const Checkout = lazy(() => import('./pages/shop/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/shop/OrderConfirmation'));
const Policy = lazy(() => import('./pages/shop/Policy'));

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <p className="font-display text-2xl italic text-ink/45">Walking Shadow Poetry</p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/poetry" element={<Poetry />} />
            <Route path="/poetry/:slug" element={<PoemDetail />} />
            <Route path="/episodes" element={<Episodes />} />
            <Route path="/episodes/:slug" element={<WordPressPostDetail />} />
            <Route path="/performances" element={<Performances />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/shop" element={<ShopHome />} />
            <Route path="/shop/clothing" element={<Clothing />} />
            <Route path="/shop/search" element={<Search />} />
            <Route path="/shop/categories/:slug" element={<Category />} />
            <Route path="/shop/products/:slug" element={<ProductDetail />} />
            <Route path="/shop/personalized" element={<Personalized />} />
            <Route path="/shop/personalized/notes" element={<CustomizedNote />} />
            <Route path="/shop/commissions" element={<Commissions />} />
            <Route path="/shop/cart" element={<Cart />} />
            <Route path="/shop/checkout" element={<Checkout />} />
            <Route path="/shop/order-confirmation/:id" element={<OrderConfirmation />} />
            <Route path="/shop/policies/:slug" element={<Policy />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

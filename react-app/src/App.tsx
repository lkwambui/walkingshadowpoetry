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
const Shop = lazy(() => import('./pages/Shop'));
const NotFound = lazy(() => import('./pages/NotFound'));

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
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

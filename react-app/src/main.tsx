import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './styles/global.css';

// Fade in lazy images on load
document.addEventListener('load', (e) => {
  const target = e.target as HTMLElement;
  if (target.tagName === 'IMG' && target.getAttribute('loading') === 'lazy') {
    target.classList.add('loaded');
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);

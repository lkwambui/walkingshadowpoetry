import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Lets localhost call the live WordPress/WooCommerce site without CORS.
      // /shop-api/shop/wp-json/... -> https://walkingshadowpoetry.com/shop/wp-json/...
      '/shop-api': {
        target: 'https://walkingshadowpoetry.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shop-api/, ''),
      },
      // /blog-api/blog/wp-json/... -> https://walkingshadowpoetry.com/blog/wp-json/...
      '/blog-api': {
        target: 'https://walkingshadowpoetry.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog-api/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    globals: false,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) {
            return 'motion'
          }
          if (id.includes('lucide-react')) return 'icons'
          if (id.includes('react-helmet-async')) return 'helmet'
          if (id.includes('react-router')) return 'router'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
            return 'react'
          }
          return 'vendor'
        },
      },
    },
  },
})

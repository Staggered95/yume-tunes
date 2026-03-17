import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Explicitly cache the icons as well so the PWA looks right offline
      includeAssets: ['logo.png', 'vite.svg', 'icon-192x192.png', 'icon-512x512.png'], 
      manifest: {
        name: 'YumeTunes',
        short_name: 'YumeTunes',
        description: 'High-Quality Anime Music Streaming Platform',
        theme_color: '#9D5CFA',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Prevents the service worker from trying to cache heavy media files
        globIgnores: ['**/media/**', '**/audio/**', '**/images/**'],
        // Increase file size limit if some of your bundled JS chunks are large
        maximumFileSizeToCacheInBytes: 3000000 
      }
    })
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
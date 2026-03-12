import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // FIX 1: Only include files that actually exist in your ls output!
      includeAssets: ['logo.png', 'vite.svg'], 
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
      }
    })
  ],
  server: {
    host: true,        // exposes on 0.0.0.0 (localhost + network IP)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        rewrite: (path) => path.replace(/^\/api/, '')  // strips /api before forwarding
      }
    }
  }
})
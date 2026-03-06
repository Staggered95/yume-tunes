import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
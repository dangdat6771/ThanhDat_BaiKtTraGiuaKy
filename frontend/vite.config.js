import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production: nginx proxies /api → backend:5000 (strips /api prefix)
// Dev: Vite dev server proxies /api → localhost:5000 (strips /api prefix)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
})

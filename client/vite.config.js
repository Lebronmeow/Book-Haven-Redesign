import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://bookhaven.ryanpereira.xyz',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    minify: 'esbuild',
    emptyOutDir: false,
  }
})

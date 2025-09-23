import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
      clientPort: 5174,
      host: '0.0.0.0'
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true
  }
})
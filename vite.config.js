import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    // ✅ Remove terser options if you don't need them
    chunkSizeWarningLimit: 1000,
  },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🧩 Single clean export (Wajib)
export default defineConfig({
  plugins: [react()],

  // Tambahkan base ini supaya semua asset bekerja di Netlify
  base: './',

  // Opsional: recommended untuk produksi
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})

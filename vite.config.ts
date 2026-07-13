import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative base so the production build also works when opened from the
  // filesystem (e.g. inside an Electron .exe via file://).
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Don't let Vite's file watcher choke on large/locked media files dropped
    // into the project folder (e.g. mp3s with "#" in the name can crash it).
    watch: {
      ignored: ['**/*.mp3', '**/*.wav', '**/*.ogg', '**/*.m4a', '**/*.flac'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/database', 'firebase/storage'],
          charts: ['chart.js', 'react-chartjs-2'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})

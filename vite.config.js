import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: '.',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'content-scripts/index.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Output content script as content.js
          if (chunkInfo.name === 'content') {
            return 'content.js'
          }
          // Output popup as popup.js
          return 'popup.js'
        },
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'popup.html') {
            return 'popup.html'
          }
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup.css'
          }
          return 'assets/[name].[ext]'
        }
      }
    },
    copyPublicDir: false,
    emptyOutDir: false,
    watch: null,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  publicDir: 'public',
  server: {
    port: 5173,
  },
})


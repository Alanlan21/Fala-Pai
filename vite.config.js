import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'FalaPai',
        short_name: 'FalaPai',
        start_url: '.',
        display: 'standalone',
        background_color: '#6B46C1',
        theme_color: '#6B46C1',
        icons: [
          {
            src: 'icons/falapai-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/falapai-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})
// This configuration file sets up a Vite project with React and PWA support.

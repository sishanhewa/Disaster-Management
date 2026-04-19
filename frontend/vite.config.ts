import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    proxy: {
      // DMC government disaster news — required by NewsScraper (ported from Disaster-Management-master)
      '/api/dmc': {
        target: 'https://www.dmc.gov.lk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dmc/, '')
      },
      // AI chatbot proxy — routes /ai/* to ClimaSphere ai-service (port 8000)
      // This keeps the GEMINI_API_KEY on the server; the browser never sees it.
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai/, '')
      }
    }
  },
  optimizeDeps: {
    include: ['recharts', 'lucide-react', 'react-leaflet', 'leaflet', 'react-is'],
    // @arcgis/core uses its own worker asset pipeline — must not be pre-bundled
    exclude: ['@arcgis/core']
  },
  ssr: {
    noExternal: ['recharts', 'lucide-react', 'react-leaflet', 'leaflet', 'date-fns', 'react-markdown', 'react-is']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            // Keep ArcGIS in its own chunk — it is ~10MB and must not inflate vendor.js
            if (id.includes('@arcgis')) return 'arcgis';
            return 'vendor';
          }
        }
      }
    }
  }
})

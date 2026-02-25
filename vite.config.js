import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Function form is required — the object form silently produces empty
        // chunks when packages share circular dependencies at build time.
        manualChunks(id) {
          if (id.includes('/node_modules/react/') || id.includes('/node_modules/react-dom/') || id.includes('/node_modules/scheduler/')) {
            return 'vendor-react';
          }
          if (id.includes('/node_modules/framer-motion/')) {
            return 'vendor-framer';
          }
          if (id.includes('/node_modules/react-router') || id.includes('/node_modules/@remix-run/')) {
            return 'vendor-router';
          }
          if (id.includes('/node_modules/i18next') || id.includes('/node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
        },
      },
    },
  },
})

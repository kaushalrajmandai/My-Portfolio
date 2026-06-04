import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/My-Portfolio/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('@react-three'))
            return 'vendor-three';
          if (id.includes('node_modules/framer-motion'))
            return 'vendor-motion';
          if (id.includes('node_modules/react'))
            return 'vendor-react';
        },
      },
    },
  },
})

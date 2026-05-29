import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Project site → served from /My-Portfolio/. Must match the repo name (for a
  // root user-site repo this would be '/').
  base: '/My-Portfolio/',
  plugins: [react(), tailwindcss()],
})

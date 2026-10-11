import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Forward /api/* to the Node.js server (see ../server/index.js).
    proxy: {
      '/api': `http://127.0.0.1:${process.env.PORT ?? 3000}`,
    },
  },
})

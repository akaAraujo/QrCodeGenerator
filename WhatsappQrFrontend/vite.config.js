import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    legacy({
      targets: ['defaults', 'Android >= 7', 'not IE 11'],
    }),
  ],
})

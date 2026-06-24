import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base matches the GitHub Pages path (https://omer72.github.io/astro/)
export default defineConfig({
  base: '/astro/',
  plugins: [react()],
})

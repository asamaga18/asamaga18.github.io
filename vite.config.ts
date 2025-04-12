import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/thetomatotrade/', // 👈 this is crucial for GitHub Pages
  plugins: [react()],
})


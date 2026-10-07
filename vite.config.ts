import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/themworkshop/',
  plugins: [react()],
  base: '/themworkshop/', // <- DODAJ TĘ LINIJKĘ (z ukośnikami z obu stron)
})

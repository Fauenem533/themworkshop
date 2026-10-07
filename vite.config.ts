import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/themworkshop/', // <- DODAJ TĘ LINIJKĘ (z ukośnikami z obu stron)
})

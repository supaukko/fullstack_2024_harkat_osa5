import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    // globals: true ansiosta testien käyttämiä avainsanoja
    // kuten describe, test ja expect ei ole tarvetta importata testeissä
    globals: true,
    setupFiles: './testSetup.js', 
  }
})

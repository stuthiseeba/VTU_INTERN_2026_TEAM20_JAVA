import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/drives': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/applications': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/students': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
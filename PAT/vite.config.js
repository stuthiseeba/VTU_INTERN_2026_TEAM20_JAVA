import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Updated: Proxy all API calls to Spring Boot on port 8080
// This fixes CORS and connects Team 3 frontend to the integrated backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
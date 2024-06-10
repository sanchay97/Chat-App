import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port:3000,
    proxy:{
      "/api":{
        // To fix CORS problem, only in development
        // In Production, no need
        target:"http://localhost:8000",
      }
    }
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '')
  
  return {
    plugins: [react()],
    define: {
      // In production, use /api, in development use localhost with PORT
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(
        mode === 'production' 
          ? '' // Empty string means use relative path
          : `http://localhost:${env.PORT}`
      )
    }
  }
})

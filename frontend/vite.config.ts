import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '../'), '');
  const PORT = env.PORT || '3456';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(''),
    },
    server: {
      proxy: {
        '/api': {
          target: `http://${env.VITE_BACKEND_URL || 'localhost'}:${PORT}`,
          changeOrigin: true,
        },
      },
    },
  };
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'index.html'),
        main: resolve(__dirname, 'src/main.tsx'),
      },
    },
  },
  publicDir: 'public',
});

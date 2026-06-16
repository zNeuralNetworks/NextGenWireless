import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    port: 3000,
    host: 'localhost',
  },
  plugins: [
    react(),
    tailwindcss({
      // Avoid production CSS optimizer hangs in Cloud Build/local CI.
      optimize: false,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});

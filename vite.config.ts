import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].[hash].mjs`,
        chunkFileNames: `[name].[hash].mjs`,
      },
    },
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:5173', // Adjust the port as needed
    },
  },
  resolve: {
    alias: {
      // Add an alias for modules with .mjs extension to .js
      
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.wasm'],
  },
});

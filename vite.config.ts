import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['/dist/index.1a386d4b.mjs'],
      output: {
        entryFileNames: `[name].[hash].mjs`,
        chunkFileNames: `[name].[hash].mjs`,
      },
    },
  },
  plugins: [react()],
  server: {
    
  },
  resolve: {
    alias: {
      // Add an alias for modules with .mjs extension to .js
      
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.wasm'],
  },
});

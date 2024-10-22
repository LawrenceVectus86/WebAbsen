// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-qr-code', '@coolcode/plugin-qr-scanner', 'xlsx', 'file-saver'],
  },
});

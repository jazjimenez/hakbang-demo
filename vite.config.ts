import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE is set to "/<repo>/" by the GitHub Pages workflow; "/" locally.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base -> works whether you deploy to
// username.github.io/repo-name/ or a custom domain.
export default defineConfig({
  plugins: [react()],
  base: './',
});

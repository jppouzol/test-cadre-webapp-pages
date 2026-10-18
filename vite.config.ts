import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Chemin de publication, fixé par la CI : /<dépôt>/ en production,
// /<dépôt>/pr-preview/pr-<N>/ en prévisualisation, / en développement local.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
});

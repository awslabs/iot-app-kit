import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    assetsInclude: ['**/*.hdr'],
    plugins: [
      react({
        // Use React plugin in all *.jsx and *.tsx files
        include: '**/*.{jsx,tsx}'
      })
    ],
    server: {
      port: 3000,
      host: true,
    },
    resolve: {
      alias: {
        path: 'rollup-plugin-node-polyfills/polyfills/path',
      },
    },
    preview: {
      port: 4000,
    },
  };
});

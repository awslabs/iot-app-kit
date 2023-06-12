import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    assetsInclude: ['**/*.hdr'],
    plugins: [react()],
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
    optimizeDeps: {
      exclude: ['@synchro-charts/core', '@synchro-charts/react'],
      esbuildOptions: {
        loader: {
          '.hdr': 'dataurl',
        },
      },
      force: true,
    },
  };
});

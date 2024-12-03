/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({ babel: { babelrc: true } }),
    nodePolyfills({
      include: ['path'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
    conditions: ['development'],
  },
  assetsInclude: ['**/*.hdr'],
  test: {
    pool: 'threads',
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts', 'jest-extended/all'],
    retry: 3,
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});

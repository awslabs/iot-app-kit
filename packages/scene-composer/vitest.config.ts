import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({ babel: { babelrc: true } })],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  assetsInclude: ['**/*.hdr'],
  test: {
    pool: 'threads',
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', 'jest-extended/all'],
    retry: 3,
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});

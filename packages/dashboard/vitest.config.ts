import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  test: {
    pool: 'threads',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'happy-dom',
    alias: {
      '~': resolve(__dirname, 'src'),
    },
    setupFiles: ['./vitest.setup.ts', 'jest-extended/all'],
    coverage: {
      thresholds: {
        statements: 50,
        branches: 75,
        functions: 50,
        lines: 50,
      },
    },
  },
});

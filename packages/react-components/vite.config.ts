/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    pool: 'threads',
    include: ['./src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'happy-dom',
    setupFiles: [
      './vitest.setup.ts',
      'vitest-canvas-mock',
      'jest-extended/all',
    ],
    retry: 3,
    coverage: {
      thresholds: {
        statements: 60,
        branches: 75,
        functions: 70,
        lines: 60,
      },
    },
  },
});

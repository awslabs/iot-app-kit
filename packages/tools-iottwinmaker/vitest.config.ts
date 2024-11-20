import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    pool: 'threads',
    globals: true,
    css: false,
    setupFiles: ['jest-extended/all'],
    coverage: {
      thresholds: {
        statements: 50,
        branches: 55,
        functions: 60,
        lines: 50,
      },
    },
  },
});
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['development'],
  },
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    pool: 'threads',
    globals: true,
    css: false,
    setupFiles: ['jest-extended/all'],
  },
});

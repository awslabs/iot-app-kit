import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['development'],
  },
  test: {
    pool: 'threads',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'happy-dom',
    setupFiles: ['jest-extended/all'],
  },
});

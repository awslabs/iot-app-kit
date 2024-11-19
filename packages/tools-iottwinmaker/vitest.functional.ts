import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    include: ['functional/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    pool: 'threads',
    globals: true,
    css: false,
    setupFiles: ['jest-extended/all'],
  },
});

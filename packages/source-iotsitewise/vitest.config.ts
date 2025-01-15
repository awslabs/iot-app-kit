import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    pool: 'threads',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    css: false,
    environment: 'happy-dom',
    setupFiles: ['jest-extended/all'],
    coverage: {
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 80,
        lines: 85,
      },
    },
  },
});

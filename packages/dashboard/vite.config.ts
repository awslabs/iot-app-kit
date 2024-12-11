/// <reference types="vitest" />
import { definePackageConfig } from '@iot-app-kit/vite-config/definePackageConfig';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default definePackageConfig({
  iotAppKitPackage: {
    dirname: __dirname,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  test: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
    setupFiles: ['./vitest.setup.ts'],
    // https://vitest.dev/guide/in-source.html#setup
    includeSource: ['src/**/*.{ts,tsx}'],
  },
  define: {
    // https://vitest.dev/guide/in-source.html#production-build
    'import.meta.vitest': 'undefined',
  },
});

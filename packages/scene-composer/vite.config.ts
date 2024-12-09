/// <reference types="vitest" />
import { definePackageConfig } from '@iot-app-kit/vite-config/definePackageConfig';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default definePackageConfig({
  iotAppKitPackage: {
    dirname: __dirname,
  },
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
  },
  assetsInclude: ['**/*.hdr'],
  test: {
    setupFiles: ['./vitest.setup.ts', 'jest-extended/all'],
    retry: 3,
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
});

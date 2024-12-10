import { definePackageConfig } from '@iot-app-kit/vite-config/definePackageConfig';
import react from '@vitejs/plugin-react';

export default definePackageConfig({
  iotAppKitPackage: {
    dirname: __dirname,
  },
  plugins: [react()],
  test: {
    setupFiles: ['./vitest.setup.ts', 'vitest-canvas-mock'],
    retry: 3,
  },
});

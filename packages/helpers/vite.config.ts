import { definePackageConfig } from '@iot-app-kit/vite-config/definePackageConfig';

export default definePackageConfig({
  iotAppKitPackage: { dirname: __dirname },
  test: {
    // https://vitest.dev/guide/in-source.html#setup
    includeSource: ['src/**/*.{ts,tsx}'],
  },
  define: {
    // https://vitest.dev/guide/in-source.html#production-build
    'import.meta.vitest': 'undefined',
  },
});

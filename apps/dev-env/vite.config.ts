import { definePackageConfig } from '@iot-app-kit/vite-config/definePackageConfig';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default definePackageConfig({
  iotAppKitPackage: { dirname: __dirname },
  plugins: [react()],
});

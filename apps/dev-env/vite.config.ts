import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    conditions: ['@iot-app-kit/development'],
  },
  plugins: [react()],
});

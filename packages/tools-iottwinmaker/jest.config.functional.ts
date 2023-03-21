import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  roots: ['./functional-tests'],
  slowTestThreshold: 999999,
};

export default config;

import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;

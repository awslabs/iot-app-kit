import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
  },
};

export default config;

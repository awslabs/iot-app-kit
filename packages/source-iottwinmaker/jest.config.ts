import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 83,
      functions: 85,
      lines: 85,
    },
  },
};

export default config;

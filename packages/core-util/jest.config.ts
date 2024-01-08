import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  coverageThreshold: {
    /**
     * starting low to account for untested code
     * since this package wasn't a part of the test command
     */
    global: {
      statements: 54,
      branches: 50,
      functions: 51,
      lines: 50,
    },
  },
};

export default config;

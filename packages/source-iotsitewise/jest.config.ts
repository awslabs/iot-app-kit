import { baseConfig } from '@iot-app-kit/jest-config';

const config = {
  ...baseConfig,
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['/src/__mocks__'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

export default config;

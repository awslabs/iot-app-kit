import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  testEnvironment: './testing/customTestEnv.ts',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '~/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  roots: ['src'],
  transform: {
    ...reactConfig.transform,
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
};

export default config;

import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '~/(.*)': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  roots: ['src'],
};

export default config;

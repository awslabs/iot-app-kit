import { reactConfig } from '@iot-app-kit/jest-config';

const config = {
  ...reactConfig,
  preset: 'ts-jest',
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '~/(.*)': '<rootDir>/src/$1',
  },
  // setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],
  roots: ['src'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      // required due to custom location of tsconfig.json configuration file
      // https://kulshekhar.github.io/ts-jest/docs/getting-started/options/tsconfig
      { tsconfig: './tsconfig.json' },
    ],
    ...reactConfig.transform,
  },
};

export default config;

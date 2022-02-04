import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'iot-app-kit',
  outputTargets: [
    {
      type: 'dist',
    },
  ],
  testing: {
    setupFilesAfterEnv: ['jest-extended'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['/typings/', '/src/testing/'],
    testPathIgnorePatterns: ['/src/testing', '/dist'],
    coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
    moduleNameMapper: {
      '\\.(css|scss|svg)$': 'identity-obj-proxy',
    },
    coverageThreshold: {
      global: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
};

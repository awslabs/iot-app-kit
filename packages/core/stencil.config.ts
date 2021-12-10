import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'iot-app-kit',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  globalStyle: 'src/globals/globals.css',
  testing: {
    setupFilesAfterEnv: ['<rootDir>/configuration/jest/setupTests.ts', 'jest-extended'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['/typings/', '/src/testing/', '/cypress', '/src/scripts'],
    testPathIgnorePatterns: ['/src/testing', '/dist', '/www'],
    coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
    moduleNameMapper: {
      '\\.(css|scss|svg)$': 'identity-obj-proxy',
    },
    modulePathIgnorePatterns: ['cypress'],
    coverageThreshold: {
      global: {
        statements: 75,
        branches: 60,
        functions: 70,
        lines: 75,
      },
    },
  },
};

import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { excludedOutputComponents } from './configuration/excludedOutputComponents';

export const config: Config = {
  namespace: 'bp-components',
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: '@amzn/sitewise-components',
      proxiesFile: '../sitewise-components-react/src/components.ts',
      excludeComponents: excludedOutputComponents,
    }),
    {
      type: 'dist',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  copy: [{ src: 'globals' }],
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
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
};

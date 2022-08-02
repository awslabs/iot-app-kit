import merge from 'merge';
import tsPreset from 'ts-jest/jest-preset';
import awsuiPreset from '@awsui/jest-preset';

import { jest } from './package.json';

export default merge.recursive(tsPreset, awsuiPreset, {
  ...jest,
  verbose: true,
  collectCoverageFrom: [
    'src/**/*',
    '!src/external/**/*',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    '!src/**/__snapshots__/*',
    '!src/three/GLTFLoader.js',
    '!src/three/tiles3d/TilesRenderer.js',
    '!src/three/tiles3d/TilesRendererBase.js',
  ],
  coverageReporters: [
    'json',
    'json-summary', // Required for jest-coverage-ratchet
    'cobertura', // required for coverlay
    'text',
    'html',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-jest.ts'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['<rootDir>/build', '<rootDir>/coverage'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/tests/__mocks__/svg.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      isolatedModules: true,
      astTransformers: {
        before: [
          {
            path: '@formatjs/ts-transformer/ts-jest-integration',
            options: {
              // options
              overrideIdFn: '[sha512:contenthash:base64:6]',
              ast: true,
            },
          },
        ],
      },
    },
  },
});

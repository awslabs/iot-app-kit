import merge from 'merge';
import tsPreset from 'ts-jest/jest-preset';
import awsuiPreset from '@awsui/jest-preset';

import { jest } from './package.json';

export default merge.recursive(tsPreset, awsuiPreset, {
  ...jest,
  verbose: true,
  reporters: [['jest-simple-dot-reporter', { color: true }]], // Replaces output for passing tests with dots, doesn't affect console logs.
  collectCoverageFrom: [
    'src/**/*',
    '!src/external/**/*',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
    '!src/**/__snapshots__/*',
    '!src/assets/**/*',
    '!src/three/GLTFLoader.js',
    '!src/three/tiles3d/TilesRenderer.js',
    '!src/three/tiles3d/TilesRendererBase.js',
    '!src/utils/sceneDocumentSnapshotCreator.ts',
    '!src/augmentations/components/three-fiber/viewpoint/ViewCursorWidget.tsx', // Skipping as this is around mouse movement & is interaction based. Should be covered in end-to-end test or manual testing.
  ],
  coverageReporters: [
    'html',
    'json-summary', // Required for jest-coverage-ratchet
    'text',
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup-jest.ts'],
  modulePathIgnorePatterns: ['e2e'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        //the content you'd placed at "global"
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
    ],
  },
  transformIgnorePatterns: ['<rootDir>/build', '<rootDir>/coverage', '<rootDir>/dist'],
  testPathIgnorePatterns: ['node_modules', 'dist', 'storybook-static'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.svg': '<rootDir>/__mocks__/svg.ts',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|hdr)$':
      '<rootDir>/__mocks__/fileMock.ts',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  testEnvironment: 'jsdom',
});

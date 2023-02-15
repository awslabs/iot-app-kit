/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  // preset: 'ts-jest',
  // clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  moduleNameMapper: {
    '\\.(svg|css|less|scss)$': '<rootDir>/testing/styleMock.js',
    '~/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  transform: {
    '.*\\.(tsx?|jsx?)$': [
      '@swc/jest',
      {
        jsc: {
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
  setupFilesAfterEnv: ['mutationobserver-shim', '<rootDir>/testing/jest-setup.ts'],
  //transform: {
  //   '.+\\.ts$': 'ts-jest',
  //   '^.+\\.tsx?$': 'ts-jest',
  //   '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  transformIgnorePatterns: [],
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
};

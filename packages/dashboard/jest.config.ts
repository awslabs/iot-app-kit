/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

export default {
  preset: 'ts-jest',
  // clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // coverageProvider: 'v8',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/testing/styleMock.js',
  },
  testEnvironment: 'jsdom',
  // setupFilesAfterEnv: ['mutationobserver-shim'],
  transform: {
    // '.+\\.ts$': 'ts-jest',
    // '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@cloudscape-design/components)/'],
};

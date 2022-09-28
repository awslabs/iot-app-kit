/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/constants.ts',
    '!src/**/index.ts',
    '!src/components.ts',
    '!src/stencil-generated/**/**',
  ],
  coverageReporters: ['json', 'json-summary', 'text', 'html'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/config/jest/styleMock.js',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['node_modules', 'dist', 'src/stencil-generated'],
  testRegex: '((\\.|/*.)(spec))\\.(ts|js|tsx)?$',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '.+\\.ts$': 'ts-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!@awsui/components-react)/',
    '<rootDir>/coverage',
    '<rootDir>/dist',
    '<rootDir>/node_modules',
  ],
  roots: ['<rootDir>/src/', '<rootDir>/node_modules/'],
  verbose: true,
};

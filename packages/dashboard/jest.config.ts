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
    '\\.(css|less)$': '<rootDir>/testing/styleMock.js',
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
  transformIgnorePatterns: [],
  setupFilesAfterEnv: ['mutationobserver-shim'],
  //transform: {
  //   '.+\\.ts$': 'ts-jest',
  //   '^.+\\.tsx?$': 'ts-jest',
  //   '^.+\\.(js|jsx)$': 'babel-jest',
  // },
  // transformIgnorePatterns: ['node_modules/(?!@awsui/components-react)/'],
};

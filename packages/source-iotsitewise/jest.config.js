// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['/src/__mocks__', 'src/time-series-data/client/legacy'],
  testPathIgnorePatterns: ['/dist'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 70,
      functions: 70,
      lines: 70,
    },
  },
};

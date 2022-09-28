// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  testPathIgnorePatterns: ['/dist'],
  coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 83,
      functions: 85,
      lines: 85,
    },
  },
};

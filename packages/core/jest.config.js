module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['jest-extended/all'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['/typings/', '/src/testing/', '/src/iotsitewise/__mocks__'],
  testPathIgnorePatterns: ['/src/testing', '/dist'],
  coverageReporters: ['text-summary', 'cobertura', 'html', 'json', 'json-summary'],
  moduleNameMapper: {
    '\\.(css|scss|svg)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};

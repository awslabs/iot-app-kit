export default {
  setupFilesAfterEnv: ['jest-extended/all'],
  maxWorkers: '50%',
  cacheDirectory: '.cache/jest',
  collectCoverageFrom: ['./src/**'],
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  transformIgnorePatterns: [],
  roots: ['./src'],
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
};

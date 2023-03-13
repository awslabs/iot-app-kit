
export default {
  setupFilesAfterEnv: ['jest-extended/all'],
  maxWorkers: '50%',
  collectCoverageFrom: ["./src/**"],
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '.*\\.(ts|js)$': [
      '@swc/jest',
    ],
  },
  transformIgnorePatterns: [],
  roots: ['./src'],
  "coverageThreshold": {
    "global": {
      "lines": 50
    }
  }
};

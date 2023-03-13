
export default {
  setupFilesAfterEnv: ['jest-extended/all'],
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

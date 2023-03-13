export default {
  setupFilesAfterEnv: ['jest-extended/all'],
  moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx'],
  collectCoverage: true,
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
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
};

const fs = require('fs');
const path = require('path');

const tsConfig = fs.existsSync('tsconfig.json')
  ? path.resolve('tsconfig.json')
  : path.resolve('./packages/related-table/tsconfig.json');

module.exports = {
  root: true,
  extends: ["iot-app-kit", 'airbnb-typescript', 'airbnb/hooks', 'plugin:prettier/recommended'],
  ignorePatterns: ['.storybook', 'stories', 'config', 'jest.config.ts', '**/*.js'],
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
  ],
  parserOptions: {
    project: tsConfig,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'no-param-reassign': 'warn',
    'react/no-array-index-key': 'warn',
    'no-plusplus': 'warn',
  },
};

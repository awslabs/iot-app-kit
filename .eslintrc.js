// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  // TODO: remove scene-composer related patterns after aligning scene-composer lint style
  ignorePatterns: [
    'cypress',
    'stencil.config.ts',
    'configuration',
    '__mocks__',
    'packages/scene-composer/src/three/*',
    'packages/scene-composer/src/typings.d.ts',
    'packages/scene-composer/translations/*',
    'packages/scene-composer/stories/*',
    'packages/scene-composer/jest.config.js',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:chai-friendly/recommended',
  ],
  plugins: ['prettier', 'chai-friendly', 'react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  settings: {
    react: {
      pragma: 'h',
    },
  },
  rules: {
    '@typescript-eslint/no-empty-function': 0,
  },
  overrides: [
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'max-len': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },
    {
      files: ['./packages/related-table/**/*'],
      extends: './packages/related-table/.eslintrc.js',
    },
    {
      files: ['./packages/scene-composer/**/*'],
      extends: './packages/scene-composer/.eslintrc.js',
    },
  ],
};

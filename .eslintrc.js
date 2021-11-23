module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: ['cypress', 'stencil.config.ts', 'configuration', '__mocks__'],
  extends: ['plugin:prettier/recommended', 'plugin:chai-friendly/recommended'],
  plugins: ['prettier', 'chai-friendly'],
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
  rules: {},
  overrides: [
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'max-len': 0,
      },
    },
    {
      files: ['./packages/related-table/**/*'],
      extends: './packages/related-table/.eslintrc.js',
    },
  ],
};

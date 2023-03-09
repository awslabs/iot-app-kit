module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
    node: true,
  },
  ignorePatterns: [
    'cypress',
    'stencil.config.ts',
    'configuration',
    '__mocks__',
    'packages/scene-composer/src/three/tiles3d/*',
    'examples/**/*',
  ],
  extends: [
    'turbo',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:chai-friendly/recommended',
  ],
  plugins: ['prettier', 'chai-friendly', 'react', 'jest', 'import'],
  globals: {
    module: true,
    process: true,
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
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-empty-function': 0,
    'react/react-in-jsx-scope': 'off', // This should always be off as of React 17 and going forward, and we should use the new JSX Transform in Typescript 4.1+ (ref: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports)
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  },
  overrides: [
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'max-len': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
      },
    },
  ],
};

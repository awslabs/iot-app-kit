module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2015, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint', 'import', 'formatjs'],
  // Note the order of the list is important
  extends: [
    'standard',
    'standard-react',
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: '16',
    },
  },
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
    // note you must disable the base rule as it can report incorrect errors
    'no-template-curly-in-string': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    // TODO: we should remove this once we get a stable version
    'no-unused-vars': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'formatjs/no-offset': 'error',
    'formatjs/blocklist-elements': [2, ['plural', 'selectordinal', 'select']],
    'formatjs/enforce-description': ['error', 'literal'],
    'formatjs/enforce-default-message': ['error', 'literal'],
    'formatjs/no-id': ['error'],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['classProperty'],
        modifiers: ['private', 'protected'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
    ],

    // TODO: fix errors then re-enable following rules
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    'chai-friendly/no-unused-expressions': 'off',
  },
  env: {
    jest: true,
    es6: true,
  },
  ignorePatterns: [
    'src/three/GLTFLoader.js',
    'src/three/tiles3d/TilesRenderer.js',
    'src/three/tiles3d/TilesRendererBase.js',
  ],
};

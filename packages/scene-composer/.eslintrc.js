module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2015, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  plugins: ['@typescript-eslint', 'import', 'formatjs', 'jest'],
  // Note the order of the list is important
  extends: [
    'standard',
    'standard-react',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
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
    'node/no-callback-literal': 'off', // This convention is dated, and mostly replaced with async/await. It's also much less important with intellisense and typescript.
    'react/react-in-jsx-scope': 'off', // This should always be off as of React 17 and going forward, and we should sue the new JSX Transform in Typescript 4.1+ (ref: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#removing-unused-react-imports)
    'chai-friendly/no-unused-expressions': 'off',
  },
  overrides: [
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'react/display-name': 'off', // display names aren't important in tests, since we won't be debugging, and this is usually just mock components.
      },
    },
  ],
  env: {
    jest: true,
    es6: true,
  },
  ignorePatterns: ['src/three/GLTFLoader.js', 'src/three/tiles3d/*'],
};

const base = require('@iot-app-kit/eslint-config');

module.exports = {
  ...base,
  root: true,
  extends: [...base.extends, 'plugin:react-hooks/recommended'],
  plugins: [...base.plugins, 'formatjs', 'react-hooks'],
  rules: {
    ...base.rules,
    // note you must disable the base rule as it can report incorrect errors
    'no-template-curly-in-string': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/ban-types': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
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
    'no-throw-literal': 'error',
  },
  overrides: [
    ...base.overrides,
    {
      files: ['*.spec.tsx', '*.spec.ts'],
      rules: {
        'react/display-name': 'off', // display names aren't important in tests, since we won't be debugging, and this is usually just mock components.
      },
    },
    {
      files: ['objectUtils.ts'], // This is a special case, the functions in here are specifically designed to work with "any" object.
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
      },
    },
  ],
  ignorePatterns: [
    ...base.ignorePatterns,
    'src/three/GLTFLoader.js',
    'src/three/tiles3d/*',
    'tools/watch-build.js',
    'src/assets/auto-gen/icons/*',
  ],
  settings: {
    ...base.settings,
    'import/resolver': {
      ...base.settings['import/resolver'],
      typescript: {
        ...base.settings['import/resolver'].typescript,
        project: ['packages/scene-composer/tsconfig.json'],
      },
      node: {
        project: ['packages/scene-composer/tsconfig.json'],
      },
    },
  },
};

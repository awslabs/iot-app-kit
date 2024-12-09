const base = require('@iot-app-kit/eslint-config');

module.exports = {
  ...base,
  root: true,
  extends: [
    ...base.extends,
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: [...base.plugins, 'jsx-a11y'],
  overrides: [
    ...base.overrides,
    {
      // Disabling explicit any rule for graph-view component since types are defined in 3p component.
      files: [
        '**/src/components/knowledge-graph/graph/graph-view.tsx',
        '**/src/components/knowledge-graph/responseParser.tsx',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
      },
    },
  ],
  settings: {
    ...base.settings,
    'import/resolver': {
      ...base.settings['import/resolver'],
      typescript: {
        ...base.settings['import/resolver'].typescript,
        project: ['packages/react-components/tsconfig.json'],
      },
      node: {
        project: ['packages/react-components/tsconfig.json'],
      },
    },
  },
};

module.exports = {
  root: true,
  extends: ['iot-app-kit', 'plugin:react-hooks/recommended', 'plugin:jsx-a11y/recommended'],
  plugins: ['jsx-a11y'],
  overrides: [
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
};

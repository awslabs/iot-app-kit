module.exports = {
  root: true,
  extends: ['iot-app-kit'],
  overrides: [
    {
      // Disabling explicit any rule for graph-view component since types are defined in 3p component.
      files: ['**/src/components/graph/graph-view.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};

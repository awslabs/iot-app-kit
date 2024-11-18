module.exports = {
  root: true,
  extends: [
    'iot-app-kit',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  plugins: ['jsx-a11y'],
  settings: {
    'import/resolver': {
      typescript: {
        project: ['packages/dashboard/tsconfig.json'],
      },
      node: {
        project: ['packages/dashboard/tsconfig.json'],
      },
    },
  },
};

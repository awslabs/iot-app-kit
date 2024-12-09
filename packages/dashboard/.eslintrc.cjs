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
  settings: {
    ...base.settings,
    'import/resolver': {
      ...base.settings['import/resolver'],
      typescript: {
        ...base.settings['import/resolver'].typescript,
        project: ['packages/dashboard/tsconfig.json'],
      },
      node: {
        project: ['packages/dashboard/tsconfig.json'],
      },
    },
  },
};

const base = require('@iot-app-kit/eslint-config');

module.exports = {
  ...base,
  root: true,
  settings: {
    ...base.settings,
    'import/resolver': {
      ...base.settings['import/resolver'],
      typescript: {
        ...base.settings['import/resolver'].typescript,
        project: ['configuration/vite-config/tsconfig.json'],
      },
      node: {
        project: ['configuration/vite-config/tsconfig.json'],
      },
    },
  },
};

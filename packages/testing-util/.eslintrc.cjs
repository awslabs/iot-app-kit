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
        project: ['packages/testing-util/tsconfig.json'],
      },
      node: {
        project: ['packages/testing-util/tsconfig.json'],
      },
    },
  },
};

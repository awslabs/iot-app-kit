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
        project: ['packages/source-iotsitewise/tsconfig.json'],
      },
      node: {
        project: ['packages/source-iotsitewise/tsconfig.json'],
      },
    },
  },
};

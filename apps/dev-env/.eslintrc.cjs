const base = require('@iot-app-kit/eslint-config');

// The pattern of manual merging is repeated in the .eslintrc.cjs files across
// the repo. Since we are using lodash-es, merge cannot be imported in this CJS
// file.

// TODO: Replace manual merging in ESLint config files. Consider migration to
// the latest ESLint which uses ESM.

module.exports = {
  ...base,
  root: true,
  settings: {
    ...base.settings,
    'import/resolver': {
      ...base.settings['import/resolver'],
      typescript: {
        ...base.settings['import/resolver'].typescript,
        project: ['apps/dev-env/tsconfig.json'],
      },
      node: {
        project: ['apps/dev-env/tsconfig.json'],
      },
    },
  },
};

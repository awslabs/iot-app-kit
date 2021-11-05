const wp = require('@cypress/webpack-preprocessor');
const { addMatchImageSnapshotPlugin } = require('cypress-image-snapshot/plugin');
const webpackOptions = require('../webpack.config');

module.exports = (on, config) => {
  on('file:preprocessor', wp({ webpackOptions }));
  addMatchImageSnapshotPlugin(on, config);
  return config;
};

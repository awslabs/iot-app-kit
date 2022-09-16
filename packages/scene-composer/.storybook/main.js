const path = require('path');
module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-controls',
    '@storybook/addon-knobs',
    '@storybook/addon-essentials',
    '@storybook/preset-scss',
    'storybook-addon-toolbar-actions/register',
  ],
  staticDirs: ['../dist','../public'],
  typescript: {
    // also valid 'react-docgen-typescript' | false

    // react-docgen-typescript is the default value, however it will
    // mess up with Enums in typescript by adding additional field to
    // the Enum object so you cannot use Object.keys(Enum) to get all
    // enum values. Change to react-docgen solves the problem and
    // react-docgen is also faster. However it has a worse error handling
    // page during dev (white screen instead of showing errors).
    // See this issue: https://github.com/storybookjs/storybook/issues/9832
    reactDocgen: 'react-docgen',
  },
  webpackFinal: async (config) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /(translations).*\.json$/,
      loader: path.resolve(__dirname, '../tools/totoro-loader.js'),
      /*options: {
        type: "module",
      },*/
    }, {
      test: /\.hdr$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]'
      }
    });
    // Return the altered config
    return config;
  },
};

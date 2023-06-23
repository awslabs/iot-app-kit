const path = require('path');

const { fromIni } = require('@aws-sdk/credential-providers');
module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-scss', 'storybook-dark-mode'],
  staticDirs: [
    '../dist',
    '../public',
    // TODO: resolve how you want to handle this, initial install hoists to root
    // but clean + reinstall occasionally installs the @matterport within the scene-composer
    // node_modules?
    // `${path.resolve('./node_modules/@matterport/webcomponent/built-bundle')}`,
    `${path.resolve('../../node_modules/@matterport/webcomponent/built-bundle')}`,
  ],
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
  env: async (config) => {
    try {
      const credential = await fromIni({
        profile: process.env.AWS_PROFILE || 'default',
      })();

      return {
        ...config,
        awsCredentials: JSON.stringify(credential),
      };
    } catch {
      // Mostly for build hosts, and other environments where you don't want to load AWS config
      return config;
    }
  },
  webpackFinal: async (config) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Make whatever fine-grained changes you need
    config.module.rules.push(
      {
        test: /(translations).*\.json$/,
        use: [path.resolve(__dirname, '../tools/totoro-loader.js')],
        /* options: {
        type: "module",
      }, */
      },
      {
        test: /\.hdr$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]',
        },
      },
    ); // Return the altered config

    return config;
  },
  core: {
    builder: 'webpack5',
  },
};

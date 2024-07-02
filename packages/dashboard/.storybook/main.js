require('dotenv').config();
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {
        sass: {
          // Require your Sass preprocessor here
          implementation: require('sass'),
        },
      },
    },
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: { reactDocgen: 'react-docgen', },
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
    config.resolve.plugins = [new TsconfigPathsPlugin()];
    config.module.rules.push(

      {
        test: /\.hdr$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]',
        },
      },
    ); // Return the altered config
    return config;
  }
};

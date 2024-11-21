import dotenv from 'dotenv';
import { dirname, join } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

dotenv.config();

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')));
}

module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/preset-scss'),
    getAbsolutePath('storybook-dark-mode'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/react-webpack5'),
    options: {
      builder: {
        useSWC: true,
        fsCache: true,
      },
    },
  },
  swc: () => ({
    jsc: {
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  }),
  typescript: {
    check: false,
    reactDocgen: false,
  },
  webpackFinal: async (config) => {
    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];
    return config;
  },
};

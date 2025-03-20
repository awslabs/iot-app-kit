import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],

  staticDirs: ['../public'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  framework: '@storybook/react-vite',

  typescript: {
    check: false,
    reactDocgen: false,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [tsconfigPaths()],
    });
  },

  docs: {},
} satisfies StorybookConfig;

export default config;

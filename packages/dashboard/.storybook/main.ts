import type { StorybookConfig } from '@storybook/react-vite';

const config = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],

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

  docs: {},
} satisfies StorybookConfig;

export default config;

import type { StorybookConfig } from '@storybook/react-vite';
import dotenv from 'dotenv';

dotenv.config();

const config = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-essentials', 'storybook-dark-mode'],

  framework: '@storybook/react-vite',

  typescript: {
    check: false,
    reactDocgen: false,
  },

  docs: {},
} satisfies StorybookConfig;

export default config;

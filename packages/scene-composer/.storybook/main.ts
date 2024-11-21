import { fromIni } from '@aws-sdk/credential-providers';
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config();

const config = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-mdx-gfm'],

  staticDirs: [
    '../dist',
    '../public',
    '../translations',
    // TODO: resolve how you want to handle this, initial install hoists to root
    // but clean + reinstall occasionally installs the @matterport within the scene-composer
    // node_modules?
    // `${path.resolve('./node_modules/@matterport/webcomponent/built-bundle')}`,
    `${path.resolve('../../node_modules/@matterport/webcomponent/built-bundle')}`,
  ],

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

  framework: '@storybook/react-vite',

  typescript: {
    check: false,
    // also valid 'react-docgen-typescript' | false

    // react-docgen-typescript is the default value, however it will
    // mess up with Enums in typescript by adding additional field to
    // the Enum object so you cannot use Object.keys(Enum) to get all
    // enum values. Change to react-docgen solves the problem and
    // react-docgen is also faster. However it has a worse error handling
    // page during dev (white screen instead of showing errors).
    // See this issue: https://github.com/storybookjs/storybook/issues/9832
    reactDocgen: false,
  },

  docs: {},
} satisfies StorybookConfig;

export default config;

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],

  staticDirs: [{ from: '../assets', to: '/assets' }],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  framework: '@storybook/react-vite',

  docs: {
    autodocs: 'tag',
  },

  managerHead: (head) => `
      ${head}
      <style>div[data-nodetype="story"] { display: none; }</style>
  `,
};

export default config;

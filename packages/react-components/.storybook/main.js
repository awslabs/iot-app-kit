module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-scss', 'storybook-dark-mode'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    check: true, // type-check stories during Storybook build
    reactDocgen: false,
  },
};

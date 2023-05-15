module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-controls', '@storybook/addon-actions', '@storybook/preset-scss', 'storybook-dark-mode'],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  typescript: {
    check: true, // type-check stories during Storybook build
    reactDocgen: false,
  },
};

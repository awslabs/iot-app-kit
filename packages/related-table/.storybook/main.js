module.exports = {
  stories: ['../stories/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-scss'],
  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  typescript: {
    check: true, // type-check stories during Storybook build
  },
};

import '@iot-app-kit/components/styles.css';


/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Overview', 'Components', 'Core', 'Data sources', 'React hooks']
      }
    }
  },
};

export default preview;

/** @type { import('@storybook/react').Preview } */
import '@iot-app-kit/components/dist/iot-app-kit-components/iot-app-kit-components.css';

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Overview', 'Components', 'Core', 'Data sources', 'React hooks'],
      },
    },
  },
};

export default preview;

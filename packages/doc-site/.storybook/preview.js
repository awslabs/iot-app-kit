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
        order: ['Introduction', 'Overview', 'Data sources', 'Components', 'Core', 'React hooks'],
      },
    },
    docs: {
      inlineStories: true,
      toc: { headingSelector: 'h2, h3, h4' }, // 👈 Enables the table of contents
    },
  },
};

export default preview;

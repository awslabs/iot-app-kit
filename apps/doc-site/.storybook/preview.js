/** @type { import('@storybook/react').Preview } */

import { handlers } from '@iot-app-kit/data-mocked/handers';
import { initialize, mswLoader } from 'msw-storybook-addon';

initialize();

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  msw: {
    handlers,
  },
};

export const loaders = [mswLoader];
export const tags = ['autodocs'];

const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    msw: {
      handlers,
    },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Overview',
          'Data sources',
          'Components',
          'Assistant',
          'Core',
          'React hooks',
        ],
      },
    },
    docs: {
      inlineStories: true,
      toc: { headingSelector: 'h2, h3, h4' }, // 👈 Enables the table of contents
    },
  },
};

export default preview;

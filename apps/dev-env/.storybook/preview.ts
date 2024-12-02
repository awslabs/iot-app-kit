import { handlers } from '@iot-app-kit/data-mocked/handers';
import { initialize, mswLoader } from 'msw-storybook-addon';
import 'tailwindcss/tailwind.css';

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

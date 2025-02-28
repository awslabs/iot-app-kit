import '@iot-app-kit/charts/dist/styles.css';
import './global.scss';

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
export const tags = ['autodocs'];

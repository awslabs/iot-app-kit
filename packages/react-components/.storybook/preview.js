import { useDarkMode } from 'storybook-dark-mode';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { useEffect } from 'react';

import '@iot-app-kit/components/dist/iot-app-kit-components/iot-app-kit-components.css';
import './global.scss';

// https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
export const parameters = {
  // https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args
  actions: { argTypesRegex: '^on.*' },
};

export const decorators = [
  (Story) => {
    const isDarkMode = useDarkMode();

    useEffect(() => {
      if (isDarkMode) {
        applyMode(Mode.Dark);
      } else {
        applyMode(Mode.Light);
      }
    }, [isDarkMode]);

    return <Story />
  }
]

import { useDarkMode } from 'storybook-dark-mode';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import { useEffect } from 'react';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

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

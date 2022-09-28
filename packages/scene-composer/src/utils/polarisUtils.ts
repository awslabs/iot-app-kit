import { defineMessages } from 'react-intl';

export const mapToSelectOption = (item: string) => ({ label: item, value: item });

export const i18nSceneIconsKeysStrings = defineMessages({
  Info: {
    defaultMessage: 'Info',
    description: 'Scene Icon types in a dropdown menu',
  },
  Warning: {
    defaultMessage: 'Warning',
    description: 'Scene Icon types in a dropdown menu',
  },
  Error: {
    defaultMessage: 'Error',
    description: 'Scene Icon types in a dropdown menu',
  },
  Video: {
    defaultMessage: 'Video',
    description: 'Scene Icon types in a dropdown menu',
  },
});

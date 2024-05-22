import type { Meta } from '@storybook/react';
import type { ResourceExplorerStoryControls } from './types';

export const SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES = {
  selectionMode: {
    control: { type: 'radio' },
    options: [undefined, 'single', 'multi'],
    defaultValue: undefined,
  },

  isFilterEnabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },

  isUserSettingsEnabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },

  isSearchEnabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },

  isTitleEnabled: { control: { type: 'boolean' }, defaultValue: true },

  shouldPersistUserCustomization: {
    control: { type: 'boolean' },
    defaultValue: false,
  },

  defaultPageSize: {
    control: { type: 'radio' },
    options: [10, 25, 100, 250],
    defaultValue: 10,
  },

  variant: {
    control: { type: 'radio' },
    options: ['table', 'drop-down'],
    defaultValue: 'table',
  },
} satisfies Meta<ResourceExplorerStoryControls<unknown>>['argTypes'];

import { type ResourceExplorerProps } from '../../src/components/resource-explorers/types/resource-explorer';
import { type ComponentMeta } from '@storybook/react';

export const SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES = {
  filterEnabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  preferencesEnabled: {
    control: { type: 'boolean' },
    defaultValue: false,
  },
  selectionType: {
    control: { type: 'radio' },
    options: [undefined, 'single', 'multi'],
    defaultValue: undefined,
  },
} satisfies ComponentMeta<
  React.JSXElementConstructor<ResourceExplorerProps>
>['argTypes'];

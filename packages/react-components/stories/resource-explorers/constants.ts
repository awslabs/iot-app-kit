import { type ResourceExplorerProps } from '../../src/components/resource-explorers/types/resource-explorer';
import { type ComponentMeta } from '@storybook/react';

export const SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES = {
  selectionType: {
    control: { type: 'radio' },
    options: [undefined, 'single', 'multi'],
    defaultValue: undefined,
  },

  defaultPageSize: {
    control: { type: 'number', min: 1 },
  },
} satisfies ComponentMeta<
  React.JSXElementConstructor<ResourceExplorerProps>
>['argTypes'];

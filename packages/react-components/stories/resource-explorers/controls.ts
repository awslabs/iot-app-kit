import type { Meta } from '@storybook/react';
import type {
  IsTableFilterEnabled,
  IsTableSearchEnabled,
  IsTableUserSettingsEnabled,
  IsTitleEnabled,
  PageSize,
  ResourceExplorerVariant,
  SelectionMode,
  ShouldPersistUserCustomization,
} from '../../src/components/resource-explorers/types/common';
import { IsDropDownFilterEnabled } from '../../src/components/resource-explorers/types/drop-down';

export interface CommonResourceExplorerControls {
  selectionMode: SelectionMode;
  shouldPersistUserCustomization: ShouldPersistUserCustomization;
  defaultPageSize: PageSize;
  variant: ResourceExplorerVariant;
  isTableTitleEnabled: IsTitleEnabled;
  isTableSearchEnabled: IsTableSearchEnabled;
  isTableFilterEnabled: IsTableFilterEnabled;
  isTableUserSettingsEnabled: IsTableUserSettingsEnabled;
  isDropDownFilterEnabled: IsDropDownFilterEnabled;
}

export const SHARED_RESOURCE_EXPLORER_STORY_ARG_TYPES = {
  selectionMode: {
    control: { type: 'radio' },
    options: [undefined, 'single', 'multi'],
    defaultValue: undefined,
  },
  defaultPageSize: {
    control: { type: 'radio' },
    options: [10, 25, 100, 250],
    defaultValue: 10,
  },
  shouldPersistUserCustomization: {
    control: { type: 'boolean' },
    defaultValue: false,
    description: 'Specify if user settings should be stored by the browser.',
  },
  variant: {
    control: { type: 'radio' },
    options: ['table', 'drop-down'],
    defaultValue: 'table',
  },
  isTableTitleEnabled: {
    name: 'tableSettings.isTitleEnabled',
    control: { type: 'boolean' },
    defaultValue: true,
    if: { arg: 'variant', eq: 'table' },
  },
  isTableSearchEnabled: {
    name: 'tableSettings.isSearchEnabled',
    control: { type: 'boolean' },
    defaultValue: false,
    if: { arg: 'variant', eq: 'table' },
  },
  isTableFilterEnabled: {
    name: 'tableSettings.isFilterEnabled',
    control: { type: 'boolean' },
    defaultValue: false,
    if: { arg: 'variant', eq: 'table' },
  },
  isTableUserSettingsEnabled: {
    name: 'tableSettings.isUserSettingsEnabled',
    control: { type: 'boolean' },
    defaultValue: false,
    if: { arg: 'variant', eq: 'table' },
  },
  isDropDownFilterEnabled: {
    name: 'dropDownSettings.isFilterEnabled',
    control: { type: 'boolean' },
    defaultValue: false,
    description: 'Enable the drop-drop down filter',
    if: { arg: 'variant', eq: 'drop-down' },
  },
} satisfies Meta<CommonResourceExplorerControls>['argTypes'];

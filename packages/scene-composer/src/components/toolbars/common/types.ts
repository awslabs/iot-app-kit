import { type IconProps } from '@cloudscape-design/components';

import { type COMPOSER_FEATURES } from '../../../interfaces';

export type ToolbarItemIconProps = Omit<IconProps, 'variant'> & {
  isMirrored?: boolean;
  scale?: number;
};

export type FeatureDefinition = { name: COMPOSER_FEATURES };

export type ToolbarItemOptions = {
  icon?: ToolbarItemIconProps;
  isDisabled?: boolean;
  isSelected?: boolean;
  label: string;
  text?: string;
  uuid: string;
  feature?: FeatureDefinition;
  subItems?: ToolbarItemOptions[];
};

export type ToolbarItemOptionRaw = Omit<ToolbarItemOptions, 'label' | 'text' | 'subItems'> & {
  subItems?: ToolbarItemOptionRaw[];
};

export type ToolbarItemType = 'button' | 'action-select' | 'mode-select';

export type ToolbarItemOrientation = 'horizontal' | 'vertical';

export enum ToolbarOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
}

export type ToolbarMenuPosition = 'right' | 'bottom-left' | 'bottom-right';

import { IconProps } from '@awsui/components-react';

import { COMPOSER_FEATURES } from '../../../interfaces';

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

export type ToolbarItemType = 'button' | 'action-select' | 'mode-select';

export type ToolbarItemOrientation = 'horizontal' | 'vertical';

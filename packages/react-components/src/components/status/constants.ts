import type { StatusSettings } from './types';

export const DEFAULT_STATUS_COLOR = '#16191f';

export const STATUS_ICON_SHRINK_FACTOR = 0.9;

export const DEFAULT_STATUS_SETTINGS: Required<StatusSettings> = {
  showUnit: true,
  showIcon: true,
  showName: true,
  showValue: true,
  color: 'black',
  fontSize: 20,
  secondaryFontSize: 20,
};

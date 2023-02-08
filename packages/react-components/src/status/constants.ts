import { StatusSettings } from './types';

export const DEFAULT_STATUS_COLOR = '#16191f';

export const STATUS_ICON_SHRINK_FACTOR = 0.7;

export const DEFAULT_STATUS_SETTINGS: Required<StatusSettings> = {
  showTimestamp: true,
  showUnit: true,
  showIcon: true,
  showName: true,
  showValue: true,
  fontSize: 30,
  secondaryFontSize: 15,
};

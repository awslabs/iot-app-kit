import type { KPISettings } from './types';

export const DEFAULT_KPI_COLOR = '#16191f';

export const KPI_ICON_SHRINK_FACTOR = 0.7;

export const DEFAULT_KPI_SETTINGS: Required<KPISettings> = {
  showTimestamp: true,
  showUnit: true,
  color: 'black',
  showIcon: true,
  showName: true,
  fontSize: 30,
  secondaryFontSize: 15,
};

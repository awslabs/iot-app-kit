import type { DialSettings } from './types';

export enum ColorConfigurations {
  BLUE = '#2E72B5',
  NORMAL = '#3F7E23',
  WARNING = '#F29D38',
  CRITICAL = '#C03F25',
  GRAY = '#D9D9D9',
  PRIMARY_TEXT = '#16191f',
  SECONDARY_TEXT = '#687078',
  WHITE = '#fff',
}

export const DEFAULT_DIAL_SETTINGS: Required<DialSettings> = {
  showName: true,
  showUnit: true,
  dialThickness: 34,
  fontSize: 48,
  unitFontSize: 24,
  labelFontSize: 24,
  yMin: 0,
  yMax: 100,
};

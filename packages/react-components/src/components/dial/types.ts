import type { WidgetSettings } from '../../common/dataTypes';

export type DialProperties = WidgetSettings & {
  settings: DialSettings;
};

export type DialSettings = {
  dialThickness?: number;
  showName?: boolean;
  showUnit?: boolean;
  fontSize?: number; // pixels
  labelFontSize?: number; // pixels
  unitFontSize?: number; // pixels
  yMin?: number | undefined;
  yMax?: number | undefined;
};

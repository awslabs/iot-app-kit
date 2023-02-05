import { WidgetSettings } from '../common/dataTypes';

export type KPIProperties = WidgetSettings & {
  settings: KPISettings;
};

export type KPISettings = {
  showTimestamp?: boolean;
  showName?: boolean;
  showIcon?: boolean;
  showUnit?: boolean;
  fontSize?: number; // pixels
  secondaryFontSize?: number; // pixels
};

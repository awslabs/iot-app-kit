import type { WidgetSettings } from '../../common/dataTypes';

export type KPIProperties = WidgetSettings & {
  settings?: Partial<KPISettings>;
};

export type KPISettings = {
  showTimestamp: boolean;
  showName: boolean;
  showIcon: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  color: string; // hex string
};

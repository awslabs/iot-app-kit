import type { WidgetSettings } from '../../common/dataTypes';

export type StatusProperties = WidgetSettings & {
  settings?: Partial<StatusSettings>;
};

export type StatusSettings = {
  color: string; // hex string
  showName: boolean;
  showIcon: boolean;
  showValue: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
};

import type { WidgetSettings } from '../../common/dataTypes';

export type StatusProperties = WidgetSettings & {
  settings?: Partial<StatusSettings>;
  aggregationType?: string;
  resolution?: number;
};

export type StatusSettings = {
  color: string; // hex string
  showName: boolean;
  showIcon: boolean;
  showValue: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  aggregationFontSize: number; // pixels
};

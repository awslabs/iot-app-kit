import type { WidgetSettings } from '../../common/dataTypes';

export type StatusProperties = WidgetSettings & {
  settings?: Partial<StatusSettings>;
  aggregationType?: string;
};

export type StatusSettings = {
  color: string; // hex string
  showAggregationAndResolution: boolean;
  showName: boolean;
  showIcon: boolean;
  showValue: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  aggregationFontSize: number; // pixels
  backgroundColor: string; // hex string
  showTimestamp: boolean;
  showAssetName: boolean;
};

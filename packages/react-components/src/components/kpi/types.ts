import type { WidgetSettings } from '../../common/dataTypes';

export type KPIProperties = WidgetSettings & {
  settings?: Partial<KPISettings>;
  isFilledThreshold?: boolean;
  isThresholdVisible?: boolean;
};

export type KPISettings = {
  showTimestamp: boolean;
  showAggregationAndResolution: boolean;
  showName: boolean;
  showIcon: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  aggregationFontSize: number; // pixels
  color: string; // hex string
  backgroundColor: string; // hex string
  showAssetName: boolean;
};

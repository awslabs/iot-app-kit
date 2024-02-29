import type { WidgetSettings } from '../../common/dataTypes';

export type KPIBaseProperties = WidgetSettings & {
  settings?: Partial<KPISettings>;
  isFilledThreshold?: boolean;
  isThresholdVisible?: boolean;
};

export type KPISettings = {
  showTimestamp: boolean;
  showAggregationAndResolution: boolean;
  showName: boolean;
  showUnit: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  backgroundColor: string; // hex string
  showAssetName: boolean;
  /** @deprecated */
  aggregationFontSize: number; // pixels
  /** @deprecated */
  color: string; // hex string
  /** @deprecated */
  showIcon: boolean;
};

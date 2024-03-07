export type StatusSettings = {
  showAggregationAndResolution: boolean;
  showName: boolean;
  showUnit: boolean;
  showDataQuality: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  backgroundColor: string; // hex string
  showTimestamp: boolean;
  showAssetName: boolean;

  /** @deprecated */
  color: string; // hex string
  /** @deprecated */
  showValue: boolean;
  /** @deprecated */
  aggregationFontSize: number; // pixels
  /** @deprecated */
  showIcon: boolean;
};

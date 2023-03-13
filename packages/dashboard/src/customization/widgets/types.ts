import { StyleSettingsMap } from '@iot-app-kit/core';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

import { Widget } from '~/types';
import { AxisSettings, ComplexFontSettings, LegendSettings, SimpleFontSettings, ThresholdSettings } from '../settings';
import { ColumnDefinition, Item } from '@iot-app-kit/table';

export type SiteWiseWriteResource = { assetId: string; propertyId: string } | { propertyAlias: string };

export type QueryConfig<S, T> = {
  source: S;
  query: T;
};

export type WriteConfig<S, T> = {
  source: S;
  resource: T;
};

export type SiteWiseQueryConfig = QueryConfig<'iotsitewise', SiteWiseAssetQuery | undefined>;
export type SiteWiseWriteConfig = WriteConfig<'iotsitewise', SiteWiseWriteResource | undefined>;

export type QueryProperties = {
  styleSettings?: StyleSettingsMap;
  queryConfig: SiteWiseQueryConfig;
};

export type WriteProperties = {
  writeConfig: SiteWiseWriteConfig;
};

export type KPIProperties = QueryProperties & {
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  showTimestamp?: boolean;
  thresholdSettings?: ThresholdSettings;
};

export type StatusProperties = QueryProperties & {
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  thresholdSettings?: ThresholdSettings;
  backgroundColor?: string;
};

export type LineChartProperties = QueryProperties & {
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  legend?: LegendSettings;
};

export type ScatterChartProperties = QueryProperties & {
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  legend?: LegendSettings;
};

export type BarChartProperties = QueryProperties & {
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  legend?: LegendSettings;
};

export type TableProperties = QueryProperties & {
  thresholdSettings?: ThresholdSettings;
  fontSettings?: ComplexFontSettings;
  items?: Item[];
  columnDefinitions?: ColumnDefinition[];
};

export type TextProperties = {
  fontSettings?: ComplexFontSettings;
  value: string;
  isUrl?: boolean;
  href?: string;
};

export type InputProperties = WriteProperties & {
  options: { label: string; id: string }[];
  selectedOption: { label: string; id: string } | undefined;
};

export type QueryWidget = Widget<QueryProperties>;

export type KPIWidget = Widget<KPIProperties>;
export type StatusWidget = Widget<StatusProperties>;
export type LineChartWidget = Widget<LineChartProperties>;
export type ScatterChartWidget = Widget<ScatterChartProperties>;
export type BarChartWidget = Widget<BarChartProperties>;
export type TableWidget = Widget<TableProperties>;
export type TextWidget = Widget<TextProperties>;
export type InputWidget = Widget<InputProperties>;

import type { StyleSettingsMap } from '@iot-app-kit/core';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { Widget } from '~/types';
import type {
  AxisSettings,
  ComplexFontSettings,
  LegendSettings,
  SimpleFontSettings,
  ThresholdSettings,
} from '../settings';
import type { TableColumnDefinition, TableItem } from '@iot-app-kit/react-components/src';

export type QueryConfig<S, T> = {
  source: S;
  query: T;
};

export type SiteWiseQueryConfig = QueryConfig<'iotsitewise', SiteWiseAssetQuery | undefined>;

export type QueryProperties = {
  styleSettings?: StyleSettingsMap;
  queryConfig: SiteWiseQueryConfig;
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
  items?: TableItem[];
  columnDefinitions?: TableColumnDefinition[];
};

export type TextProperties = {
  fontSettings?: ComplexFontSettings;
  value: string;
  isUrl?: boolean;
  href?: string;
};

export type QueryWidget = Widget<QueryProperties>;

export type KPIWidget = Widget<KPIProperties>;
export type StatusWidget = Widget<StatusProperties>;
export type LineChartWidget = Widget<LineChartProperties>;
export type ScatterChartWidget = Widget<ScatterChartProperties>;
export type BarChartWidget = Widget<BarChartProperties>;
export type TableWidget = Widget<TableProperties>;
export type TextWidget = Widget<TextProperties>;

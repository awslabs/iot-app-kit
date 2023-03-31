import type { StyleSettingsMap, ThresholdSettings } from '@iot-app-kit/core';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import type { DashboardWidget } from '~/types';
import type { AxisSettings, ComplexFontSettings, SimpleFontSettings, ThresholdWithId } from '../settings';
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
  thresholds?: ThresholdWithId[];
};

export type StatusProperties = QueryProperties & {
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  thresholds?: ThresholdWithId[];
  backgroundColor?: string;
};

export type LineChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
};

export type StatusTimelineProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
};

export type ScatterChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
};

export type BarChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
};

export type TableProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
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

export type QueryWidget = DashboardWidget<QueryProperties>;

export type KPIWidget = DashboardWidget<KPIProperties>;
export type StatusWidget = DashboardWidget<StatusProperties>;
export type LineChartWidget = DashboardWidget<LineChartProperties>;
export type ScatterChartWidget = DashboardWidget<ScatterChartProperties>;
export type BarChartWidget = DashboardWidget<BarChartProperties>;
export type TableWidget = DashboardWidget<TableProperties>;
export type TextWidget = DashboardWidget<TextProperties>;
export type StatusTimelineWidget = DashboardWidget<StatusTimelineProperties>;

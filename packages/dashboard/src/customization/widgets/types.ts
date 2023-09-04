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
  significantDigits?: number;
};
export type KPIPropertiesKeys = keyof KPIProperties;

export type StatusProperties = QueryProperties & {
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  thresholds?: ThresholdWithId[];
  backgroundColor?: string;
  significantDigits?: number;
};
export type StatusPropertiesKeys = keyof StatusProperties;

export type LineChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
};
export type LineChartPropertiesKeys = keyof LineChartProperties;

export type StatusTimelineProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
};
export type StatusTimelinePropertiesKeys = keyof StatusTimelineProperties;

export type ScatterChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
};
export type ScatterChartPropertiesKeys = keyof ScatterChartProperties;

export type BarChartProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
};
export type BarChartPropertiesKeys = keyof BarChartProperties;

export type TableProperties = QueryProperties & {
  thresholds?: ThresholdWithId[];
  fontSettings?: ComplexFontSettings;
  items?: TableItem[];
  columnDefinitions?: TableColumnDefinition[];
  significantDigits?: number;
};
export type TablePropertiesKeys = keyof TableProperties;

export type TextProperties = {
  fontSettings?: ComplexFontSettings;
  value: string;
  isUrl?: boolean;
  href?: string;
};

export type RectangleProperties = {
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  fill?: string;
  borderColor?: string;
  borderThickness?: number;
};

type Point = {
  x: number;
  y: number;
};

export type LineProperties = {
  start: Point;
  end: Point;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  color?: string;
  thickness?: number;
};

export type TriangleProperties = {
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  fill?: string;
  borderColor?: string;
  borderThickness?: number;
};

type ChartPropertiesUnion =
  | KPIProperties
  | StatusProperties
  | LineChartProperties
  | ScatterChartProperties
  | BarChartProperties
  | TableProperties
  | StatusTimelineProperties;
type ChartPropertiesKeysIntersection = KPIPropertiesKeys &
  StatusPropertiesKeys &
  LineChartPropertiesKeys &
  BarChartPropertiesKeys &
  TablePropertiesKeys &
  StatusTimelinePropertiesKeys;
export type CommonChartProperties = Pick<ChartPropertiesUnion, ChartPropertiesKeysIntersection>;

export type QueryWidget = DashboardWidget<QueryProperties>;

export type KPIWidget = DashboardWidget<KPIProperties>;
export type StatusWidget = DashboardWidget<StatusProperties>;
export type LineChartWidget = DashboardWidget<LineChartProperties>;
export type ScatterChartWidget = DashboardWidget<ScatterChartProperties>;
export type BarChartWidget = DashboardWidget<BarChartProperties>;
export type TableWidget = DashboardWidget<TableProperties>;
export type TextWidget = DashboardWidget<TextProperties>;
export type StatusTimelineWidget = DashboardWidget<StatusTimelineProperties>;
export type RectangleWidget = DashboardWidget<RectangleProperties>;
export type LineWidget = DashboardWidget<LineProperties>;
export type TriangleWidget = DashboardWidget<TriangleProperties>;

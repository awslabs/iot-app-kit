import type {
  StyleSettingsMap,
  StyledThreshold,
  ThresholdSettings,
} from '@iot-app-kit/core';
import type {
  AssetPropertyQuery,
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
  SiteWiseAssetModelQuery,
  SiteWiseAlarmQuery,
  SiteWiseAlarmAssetModelQuery,
} from '@iot-app-kit/source-iotsitewise';
import type { DashboardWidget } from '~/types';
import type {
  AxisSettings,
  ComplexFontSettings,
  SimpleFontSettings,
  ThresholdWithId,
} from '../settings';
import type {
  AssistantProperty,
  TableColumnDefinition,
  TableItem,
} from '@iot-app-kit/react-components';
import { type AggregateType } from '@aws-sdk/client-iotsitewise';

export type QueryConfig<S, T> = {
  source: S;
  query: T;
};

export type SiteWiseQueryConfig = QueryConfig<
  'iotsitewise',
  | ((Partial<SiteWiseAssetQuery> &
      Partial<SiteWisePropertyAliasQuery> &
      Partial<SiteWiseAssetModelQuery>) &
      Partial<SiteWiseAlarmQuery> &
      Partial<SiteWiseAlarmAssetModelQuery>)
  | undefined
>;

export type QueryProperties = {
  styleSettings?: StyleSettingsMap;
  queryConfig: SiteWiseQueryConfig;
};

export type KPIProperties = QueryProperties & {
  title?: string;
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showAggregationAndResolution?: boolean;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  showTimestamp?: boolean;
  showDataQuality?: boolean;
  thresholds?: StyledThreshold[];
  backgroundColor?: string;
  significantDigits?: number;
  assistant?: AssistantProperty;
};

export type KPIPropertiesKeys = keyof KPIProperties;

export type StatusProperties = QueryProperties & {
  title?: string;
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showAggregationAndResolution?: boolean;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  showDataQuality?: boolean;
  thresholds?: StyledThreshold[];
  showTimestamp?: boolean;
  backgroundColor?: string;
  significantDigits?: number;
};

export type StatusPropertiesKeys = keyof StatusProperties;

export type StatusTimelineProperties = QueryProperties & {
  title?: string;
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
};

export type StatusTimelinePropertiesKeys = keyof StatusTimelineProperties;

export type LineAndScatterStyles = {
  significantDigits?: number;
  color?: string;
  symbol?: SymbolStyles;
  line?: LineStyles;
  aggregationType?: AggregateType;
  resolution?: string;
};

export type LineStyles = {
  connectionStyle?:
    | 'none'
    | 'linear'
    | 'curve'
    | 'step-start'
    | 'step-middle'
    | 'step-end';
  style?: 'solid' | 'dotted' | 'dashed';
  thickness?: number;
  color?: string;
};

export type SymbolStyles = {
  visible?: boolean;
  style?:
    | 'circle'
    | 'filled-circle'
    | 'rectangle'
    | 'rounded-rectangle'
    | 'triangle'
    | 'diamond'
    | 'pin'
    | 'arrow'
    | 'none';
  color?: string;
  size?: number;
};

export type AssetPropertyStyles = LineAndScatterStyles & {
  name?: string;
  yAxis?: YAxisOptions;
};
export type StyledAssetPropertyQuery = AssetPropertyQuery & AssetPropertyStyles;

export type StyledAssetQuery = {
  assets?: {
    assetId: SiteWiseAssetQuery['assets'][number]['assetId'];
    properties: StyledAssetPropertyQuery[];
  }[];
  properties?: (SiteWisePropertyAliasQuery['properties'][number] &
    AssetPropertyStyles)[];
  assetModels?: {
    assetModelId: SiteWiseAssetModelQuery['assetModels'][number]['assetModelId'];
    assetIds?: SiteWiseAssetModelQuery['assetModels'][number]['assetIds'];
    properties: StyledAssetPropertyQuery[];
  }[];
  alarms?: {
    assetId: SiteWiseAlarmQuery['alarms'][number]['assetId'];
    alarmComponents: SiteWiseAlarmQuery['alarms'][number]['alarmComponents'];
  }[];
  alarmModels?: {
    assetModelId: SiteWiseAlarmAssetModelQuery['alarmModels'][number]['assetModelId'];
    assetIds?: SiteWiseAlarmAssetModelQuery['alarmModels'][number]['assetIds'];
    alarmComponents: SiteWiseAlarmQuery['alarms'][number]['alarmComponents'];
  }[];
  requestSettings?: SiteWiseAlarmQuery['requestSettings'];
};

type YAxisRange = {
  yMin?: number;
  yMax?: number;
};

export type YAxisOptions = YAxisRange & {
  visible?: boolean;
};

export type ChartAxisOptions = YAxisRange & {
  yVisible?: boolean;
  xVisible?: boolean;
  yLabel?: string;
};

type ChartLegendContent =
  | 'latestValue'
  | 'unit'
  | 'asset'
  | 'minValue'
  | 'maxValue'
  | 'latestAlarmStateValue';
export type ChartLegend = {
  visible?: boolean;
  position?: 'left' | 'bottom' | 'right';
  height?: string;
  width?: string;
  visibleContent?: { [key in ChartLegendContent]?: boolean };
};

export type StyledSiteWiseQueryConfig = QueryConfig<
  'iotsitewise',
  StyledAssetQuery | undefined
>;

export type LineScatterChartProperties = LineAndScatterStyles & {
  title?: string;
  thresholds?: StyledThreshold[];
  axis?: ChartAxisOptions;
  legend?: ChartLegend;
  queryConfig: StyledSiteWiseQueryConfig;
  assistant?: AssistantProperty;
};

export type LineScatterChartPropertiesKeys = keyof LineScatterChartProperties;

export type BarChartProperties = QueryProperties & {
  title?: string;
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
  resolution?: string;
  aggregationType?: AggregateType;
};

export type BarChartPropertiesKeys = keyof BarChartProperties;

export type TableProperties = QueryProperties & {
  title?: string;
  thresholds?: ThresholdWithId[];
  fontSettings?: ComplexFontSettings;
  items?: TableItem[];
  columnDefinitions?: TableColumnDefinition[];
  significantDigits?: number;
  pageSize?: number;
  assistant?: AssistantProperty;
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

export type GaugeProperties = QueryProperties & {
  title?: string;
  gaugeThickness?: number;
  showName?: boolean;
  showUnit?: boolean;
  fontSize?: number;
  labelFontSize?: number;
  unitFontSize?: number;
  yMin?: number;
  yMax?: number;
  thresholds?: StyledThreshold[];
  significantDigits?: number;
  assistant?: AssistantProperty;
};

type ChartPropertiesUnion =
  | KPIProperties
  | StatusProperties
  | BarChartProperties
  | TableProperties
  | StatusTimelineProperties;
type ChartPropertiesKeysIntersection = KPIPropertiesKeys &
  StatusPropertiesKeys &
  BarChartPropertiesKeys &
  TablePropertiesKeys &
  StatusTimelinePropertiesKeys;
export type CommonChartProperties = Pick<
  ChartPropertiesUnion,
  ChartPropertiesKeysIntersection
>;

export type QueryWidget = DashboardWidget<QueryProperties>;

export type GaugeWidget = DashboardWidget<GaugeProperties>;
export type KPIWidget = DashboardWidget<KPIProperties>;
export type StatusWidget = DashboardWidget<StatusProperties>;
export type LineScatterChartWidget =
  DashboardWidget<LineScatterChartProperties>;
export type BarChartWidget = DashboardWidget<BarChartProperties>;
export type TableWidget = DashboardWidget<TableProperties>;
export type TextWidget = DashboardWidget<TextProperties>;
export type StatusTimelineWidget = DashboardWidget<StatusTimelineProperties>;
export type RectangleWidget = DashboardWidget<RectangleProperties>;
export type LineWidget = DashboardWidget<LineProperties>;

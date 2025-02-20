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
import type { RegisteredWidget } from '~/types/widgets';
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

export type QueryWidget = RegisteredWidget<QueryProperties>;

export type GaugeWidget = RegisteredWidget<GaugeProperties>;
export type KPIWidget = RegisteredWidget<KPIProperties>;
export type StatusWidget = RegisteredWidget<StatusProperties>;
export type LineScatterChartWidget =
  RegisteredWidget<LineScatterChartProperties>;
export type TableWidget = RegisteredWidget<TableProperties>;
export type TextWidget = RegisteredWidget<TextProperties>;
export type StatusTimelineWidget = RegisteredWidget<StatusTimelineProperties>;
export type RectangleWidget = RegisteredWidget<RectangleProperties>;
export type LineWidget = RegisteredWidget<LineProperties>;

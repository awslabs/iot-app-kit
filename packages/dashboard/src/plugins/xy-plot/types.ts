import type { StyledThreshold } from '@iot-app-kit/core';
import type { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { QueryConfig } from '~/features/queries/queries';
import type {
  AssetPropertyQuery,
  SiteWiseAlarmAssetModelQuery,
  SiteWiseAlarmQuery,
  SiteWiseAssetModelQuery,
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import type { AssistantProperty } from '@iot-app-kit/react-components';

export type XYPlotProperties = LineAndScatterStyles & {
  title?: string;
  thresholds?: StyledThreshold[];
  axis?: ChartAxisOptions;
  legend?: ChartLegend;
  queryConfig: StyledSiteWiseQueryConfig;
  assistant?: AssistantProperty;
};

export type LineAndScatterStyles = {
  significantDigits?: number;
  color?: string;
  symbol?: SymbolStyles;
  line?: LineStyles;
  aggregationType?: AggregateType;
  resolution?: string;
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

export type ChartAxisOptions = YAxisRange & {
  yVisible?: boolean;
  xVisible?: boolean;
  yLabel?: string;
};

export interface YAxisRange {
  yMin?: number;
  yMax?: number;
}

export type ChartLegend = {
  visible?: boolean;
  position?: 'left' | 'bottom' | 'right';
  height?: string;
  width?: string;
  visibleContent?: { [key in ChartLegendContent]?: boolean };
};

export type ChartLegendContent =
  | 'latestValue'
  | 'unit'
  | 'asset'
  | 'minValue'
  | 'maxValue'
  | 'latestAlarmStateValue';

export type StyledSiteWiseQueryConfig = QueryConfig<
  'iotsitewise',
  StyledAssetQuery | undefined
>;

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

export type AssetPropertyStyles = LineAndScatterStyles & {
  name?: string;
  yAxis?: YAxisOptions;
};

export type StyledAssetPropertyQuery = AssetPropertyQuery & AssetPropertyStyles;

export type YAxisOptions = YAxisRange & {
  visible?: boolean;
};

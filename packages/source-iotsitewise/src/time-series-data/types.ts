import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import { type SOURCE as IoTEventsSource } from '../alarms/iotevents';
import type {
  CacheSettings,
  DataStreamQuery,
  EdgeMode,
  RefId,
} from '@iot-app-kit/core';

export const AUTO_RESOLUTION = undefined;
export const RAW_RESOLUTION = '0';
export const ONE_MINUTE_RESOLUTION = '1m';
export const FIFTEEN_MINUTE_RESOLUTION = '15m';
export const ONE_HOUR_RESOLUTION = '1h';
export const ONE_DAY_RESOLUTION = '1d';

export type AutoResolution = typeof AUTO_RESOLUTION;
export type RawResolution = typeof RAW_RESOLUTION;
export type OneMinuteResolution = typeof ONE_MINUTE_RESOLUTION;
export type FifteenMinuteResolution = typeof FIFTEEN_MINUTE_RESOLUTION;
export type OneHourResolution = typeof ONE_HOUR_RESOLUTION;
export type OneDayResolution = typeof ONE_DAY_RESOLUTION;
export type AggregateResolution =
  | OneMinuteResolution
  | FifteenMinuteResolution
  | OneHourResolution
  | OneDayResolution;
export type Resolution = AutoResolution | RawResolution | AggregateResolution;

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

export type AlarmSource = typeof IoTEventsSource;

export type AssetPropertyId = string;

export type PropertyAlias = string;

export type AssetId = string;

export type AssetModelId = string;

export type AssetCompositeModelId = string;

export type RequestSettings = {
  refreshRate?: number;
};

export type AssetPropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: Resolution;
  cacheSettings?: CacheSettings;
  aggregationType?: AggregateType;
  alarms?: boolean;
};

export type PropertyAliasQuery = {
  propertyAlias: PropertyAlias;
  refId?: RefId;
  resolution?: Resolution;
  aggregationType?: AggregateType;
  cacheSettings?: CacheSettings;
};

type AssetModelPropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: Resolution;
  cacheSettings?: CacheSettings;
  aggregationType?: AggregateType;
};

export type AssetQuery = {
  assetId: AssetId;
  properties: AssetPropertyQuery[];
};

export type AssetModelQuery = {
  assetModelId: AssetModelId;
  assetIds?: AssetId[]; // can map multiple assets
  properties: AssetModelPropertyQuery[];
};

export type AlarmAssetModelQuery = {
  assetModelId: AssetModelId;
  assetIds?: AssetId[]; // can map multiple assets
  alarmComponents: AlarmComponentQuery[];
};

export type AlarmComponentQuery = {
  /**
   * Asset composite model id for alarm.
   * Will be used to get the state / source / type
   */
  assetCompositeModelId: AssetCompositeModelId;
};

// Styled anomaly query
export type AnomalyQuery = {
  assetId: string;
  predictionDefinitionId: string;

  decimalPlaces?: number;
  // color theme override for series data
  color?: string[];
};

export type AlarmQuery = {
  assetId: AssetId;
  alarmComponents: AlarmComponentQuery[];
};

export type SiteWiseAssetQuery = DataStreamQuery & {
  assets: AssetQuery[];
  requestSettings?: RequestSettings;
};

export type SiteWisePropertyAliasQuery = DataStreamQuery & {
  properties: PropertyAliasQuery[];
  requestSettings?: RequestSettings;
};

export type SiteWiseAssetModelQuery = DataStreamQuery & {
  assetModels: AssetModelQuery[];
  requestSettings?: RequestSettings;
};

export type SiteWiseAlarmAssetModelQuery = {
  alarmModels: AlarmAssetModelQuery[];
  requestSettings?: RequestSettings;
};

/**
 * configure queries for alarms explicitly
 * by assetId + alarm compositeModelId
 */
export type SiteWiseAlarmQuery = {
  alarms: AlarmQuery[];
  requestSettings?: RequestSettings & {
    aggregationType?: AggregateType;
    resolution?: Resolution;
  };
};

export type SiteWiseDataStreamQuery = Partial<SiteWiseAssetQuery> &
  Partial<SiteWisePropertyAliasQuery>;

export type SiteWiseAnomalyDataStreamQuery = Partial<AnomalyQuery>;

export type SiteWiseAlarmDataStreamQuery = Partial<SiteWiseAlarmQuery>;

export type SiteWiseDataSourceSettings = {
  batchDuration?: number;
  edgeMode?: EdgeMode;
};

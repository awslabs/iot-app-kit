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

export type AlarmSource = typeof IoTEventsSource;

export type AssetPropertyId = string;
export type PropertyAlias = string;
export type AssetId = string;
export type AssetModelId = string;
export type AssetCompositeModelId = string;

export interface RequestSettings {
  refreshRate?: number;
}

export interface AssetPropertyQuery {
  propertyId: string;
  refId?: RefId;
  resolution?: Resolution;
  cacheSettings?: CacheSettings;
  aggregationType?: AggregateType;
  alarms?: boolean;
}

export interface PropertyAliasQuery {
  propertyAlias: PropertyAlias;
  refId?: RefId;
  resolution?: Resolution;
  aggregationType?: AggregateType;
  cacheSettings?: CacheSettings;
}

export interface SiteWisePropertyAliasQuery extends DataStreamQuery {
  properties: PropertyAliasQuery[];
  requestSettings?: RequestSettings;
}

interface AssetModelPropertyQuery {
  propertyId: string;
  refId?: RefId;
  resolution?: Resolution;
  cacheSettings?: CacheSettings;
  aggregationType?: AggregateType;
}

export interface AssetQuery {
  assetId: AssetId;
  properties: AssetPropertyQuery[];
}

export interface AssetModelQuery {
  assetModelId: AssetModelId;
  assetIds?: AssetId[]; // can map multiple assets
  properties: AssetModelPropertyQuery[];
}

export interface AlarmAssetModelQuery {
  assetModelId: AssetModelId;
  assetIds?: AssetId[]; // can map multiple assets
  alarmComponents: AlarmComponentQuery[];
}

export interface AlarmComponentQuery {
  /**
   * Asset composite model id for alarm.
   * Will be used to get the state / source / type
   */
  assetCompositeModelId: AssetCompositeModelId;
}

// Styled anomaly query
export interface AnomalyQuery {
  assetId: string;
  predictionDefinitionId: string;

  decimalPlaces?: number;
  // color theme override for series data
  color?: string[];
}

export interface AlarmQuery {
  assetId: AssetId;
  alarmComponents: AlarmComponentQuery[];
}

export interface SiteWiseAssetQuery extends DataStreamQuery {
  assets: AssetQuery[];
  requestSettings?: RequestSettings;
}

export interface SiteWiseAssetModelQuery extends DataStreamQuery {
  assetModels: AssetModelQuery[];
  requestSettings?: RequestSettings;
}

export interface SiteWiseAlarmAssetModelQuery {
  alarmModels: AlarmAssetModelQuery[];
  requestSettings?: RequestSettings;
}

/**
 * configure queries for alarms explicitly
 * by assetId + alarm compositeModelId
 */
export interface SiteWiseAlarmQuery {
  alarms: AlarmQuery[];
  requestSettings?: RequestSettings & {
    aggregationType?: AggregateType;
    resolution?: Resolution;
  };
}

export type SiteWiseDataStreamQuery = Partial<SiteWiseAssetQuery> &
  Partial<SiteWisePropertyAliasQuery>;

export type SiteWiseAnomalyDataStreamQuery = Partial<AnomalyQuery>;

export type SiteWiseAlarmDataStreamQuery = Partial<SiteWiseAlarmQuery>;

export interface SiteWiseDataSourceSettings {
  batchDuration?: number;
  edgeMode?: EdgeMode;
}

import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SOURCE as IoTEventsSource } from '../alarms/iotevents';
import type {
  CacheSettings,
  DataStreamQuery,
  EdgeMode,
  RefId,
} from '@iot-app-kit/core';

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

export type AlarmSource = typeof IoTEventsSource;

export type AssetPropertyId = string;

export type PropertyAlias = string;

export type AssetId = string;

export type AssetModelId = string;

export type RequestSettings = {
  refreshRate?: number;
};

export type AssetPropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
  aggregationType?: AggregateType;
  alarms?: boolean;
};

export type PropertyAliasQuery = {
  propertyAlias: PropertyAlias;
  refId?: RefId;
  resolution?: string;
  aggregationType?: AggregateType;
  cacheSettings?: CacheSettings;
};

type AssetModelPropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
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

// Styled anomaly query
export type AnomalyQuery = {
  assetId: string;
  predictionDefinitionId: string;

  decimalPlaces?: number;
  // color theme override for series data
  color?: string[];
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

export type SiteWiseDataStreamQuery = Partial<SiteWiseAssetQuery> &
  Partial<SiteWisePropertyAliasQuery>;

export type SiteWiseAnomalyDataStreamQuery = Partial<AnomalyQuery>;

export type SiteWiseDataSourceSettings = {
  batchDuration?: number;
  edgeMode?: EdgeMode;
};

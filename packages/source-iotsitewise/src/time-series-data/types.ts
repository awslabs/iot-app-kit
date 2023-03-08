import { CacheSettings, DataStreamQuery, RefId } from '@iot-app-kit/core';
import { SOURCE as IoTEventsSource } from '../alarms/iotevents';

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

export type AlarmSource = typeof IoTEventsSource;

export type AssetPropertyId = string;

export type PropertyAlias = string;

export type AssetId = string;

export type AssetPropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
  alarms?: boolean;
};

export type PropertyAliasQuery = {
  propertyAlias: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
};

export type AssetQuery = {
  assetId: AssetId;
  properties: AssetPropertyQuery[];
};

export type SiteWiseAssetQuery = DataStreamQuery & {
  assets: AssetQuery[];
};

export type SiteWisePropertyAliasQuery = DataStreamQuery & {
  properties: PropertyAliasQuery[];
};

export type SiteWiseDataStreamQuery = Partial<SiteWiseAssetQuery> & Partial<SiteWisePropertyAliasQuery>;

export type SiteWiseDataSourceSettings = {
  batchDuration?: number;
};

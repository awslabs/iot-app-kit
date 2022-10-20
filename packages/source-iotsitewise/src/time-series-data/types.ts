import { CacheSettings, DataStreamQuery, RefId } from '@iot-app-kit/core';
import { SOURCE as IoTEventsSource } from '../alarms/iotevents';

/**
 * Learn more about AWS IoT SiteWise assets at https://docs.aws.amazon.com/iot-sitewise/latest/userguide/industrial-asset-models.html
 */

export type AlarmSource = typeof IoTEventsSource;

export type AssetPropertyId = string;

export type AssetId = string;

export type PropertyQuery = {
  propertyId: string;
  refId?: RefId;
  resolution?: string;
  cacheSettings?: CacheSettings;
  alarms?: boolean;
};

export type AssetQuery = {
  assetId: AssetId;
  properties: PropertyQuery[];
};

export type SiteWiseAssetQuery = {
  assets: AssetQuery[];
};

export type SiteWiseAssetDataStreamQuery = DataStreamQuery & SiteWiseAssetQuery;

export type SiteWiseDataStreamQuery = SiteWiseAssetDataStreamQuery;

export type SiteWiseDataSourceSettings = {
  batchDuration?: number;
  legacyAPI?: boolean;
};

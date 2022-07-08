import { CacheSettings, DataStreamQuery, RefId } from '@iot-app-kit/core';
import { StreamAssociation, StreamType } from '@synchro-charts/core';
import { SOURCE as IoTEventsSource } from '../time-series-data/alarms/iotevents';

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
  associatedStreams?: StreamAssociation[];
  streamType?: StreamType;
  alarmSource?: AlarmSource;
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

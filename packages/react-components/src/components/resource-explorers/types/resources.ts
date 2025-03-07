import type { AssetSummary } from '@aws-sdk/client-iotsitewise';

export interface AssetModelResource {
  assetModelId: string;
  name: string;
  description?: string;
}

export interface AssetResource {
  assetId: string;
  name: string;
  assetModelId: string;
  description: string;
  hierarchies: AssetSummary['hierarchies'];
}

export interface AssetPropertyResource {
  propertyId: string;
  name: string;
  assetId: string;
  alias?: string;
  dataType: string;
  dataTypeSpec?: string;
  unit?: string;
}

export interface AlarmResource {
  name: string;
  assetId: string;
  assetModelId: string;
  assetCompositeModelId: string;
  inputPropertyId?: string;
  inputPropertyName?: string;
}

export interface AlarmModelResource {
  assetModelId: string;
  assetCompositeModelId: string;
  name: string;
}

export type AlarmResourceWithLatestValue =
  DataStreamResourceWithLatestValue<AlarmResource>;

export type AssetPropertyResourceWithLatestValue =
  DataStreamResourceWithLatestValue<AssetPropertyResource>;

export interface TimeSeriesResource {
  timeSeriesId: string;
  assetId?: string;
  propertyId?: string;
  alias?: string;
  dataType: string;
  dataTypeSpec?: string;
}

export type TimeSeriesResourceWithLatestValue =
  DataStreamResourceWithLatestValue<TimeSeriesResource>;

export type DataStreamResourceWithLatestValue<DataStreamResource> =
  DataStreamResource & {
    latestValue?: number | string | boolean | null;
    latestValueTimestamp?: number;
  };

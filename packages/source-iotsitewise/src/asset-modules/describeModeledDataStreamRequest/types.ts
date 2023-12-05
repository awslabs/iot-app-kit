import {
  type ListAssetPropertiesCommandOutput,
  type ListAssetModelPropertiesCommandOutput,
} from '@aws-sdk/client-iotsitewise';

export type ModeledDataStream = {
  assetId: string;
  assetName?: string;
  propertyId: string;
  name?: string;
  unit?: string;
  dataType?: string;
  dataTypeSpec?: string;
};

export type AssetPropertyId = string;

export type AssetModelId = string;
export type AssetModelProperty = NonNullable<
  ListAssetModelPropertiesCommandOutput['assetModelPropertySummaries']
>[number];
export type AssetModelPropertyId = string;
export type AssetId = string;
export type AssetProperty = NonNullable<ListAssetPropertiesCommandOutput['assetPropertySummaries']>[number];

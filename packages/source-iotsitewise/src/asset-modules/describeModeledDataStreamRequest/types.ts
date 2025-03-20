import type {
  DescribeAssetCommandOutput,
  ListAssetModelPropertiesCommandOutput,
  ListAssetPropertiesCommandOutput,
} from '@aws-sdk/client-iotsitewise';

export interface ModeledDataStream {
  assetId: string;
  assetName?: string;
  propertyId: string;
  name?: string;
  unit?: string;
  dataType?: string;
  dataTypeSpec?: string;
}

export type Asset = NonNullable<DescribeAssetCommandOutput>;
export type AssetId = string;
export type AssetProperty = NonNullable<
  ListAssetPropertiesCommandOutput['assetPropertySummaries']
>[number];
export type AssetPropertyId = string;

export type AssetModelId = string;
export type AssetModelProperty = NonNullable<
  ListAssetModelPropertiesCommandOutput['assetModelPropertySummaries']
>[number];
export type AssetModelPropertyId = string;

import type { DescribeAssetCommandOutput } from '@aws-sdk/client-iotsitewise';

type AssetProperty = NonNullable<
  DescribeAssetCommandOutput['assetProperties']
>[number];

export type ModeledDataStream = {
  assetId: NonNullable<DescribeAssetCommandOutput['assetId']>;
  assetName: NonNullable<DescribeAssetCommandOutput['assetName']>;
  propertyId: NonNullable<AssetProperty['id']>;
  name: NonNullable<AssetProperty['name']>;
  unit: NonNullable<AssetProperty['unit']>;
  dataType: NonNullable<AssetProperty['dataType']>;
  dataTypeSpec: NonNullable<AssetProperty['dataTypeSpec']>;
};

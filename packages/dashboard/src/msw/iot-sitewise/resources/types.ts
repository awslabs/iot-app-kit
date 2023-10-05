import type { DescribeAssetResponse, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

export interface Asset extends DescribeAssetResponse {
  assetId: NonNullable<DescribeAssetResponse['assetId']>;
}

export interface AssetModel extends DescribeAssetModelResponse {
  assetModelId: NonNullable<DescribeAssetModelResponse['assetModelId']>;
}

import { AssetSummary, DescribeAssetResponse } from "@aws-sdk/client-iotsitewise";

export const ASSET_SUMMARY: AssetSummary = {
  id: 'some-asset-id',
  name: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  creationDate: undefined,
  lastUpdateDate: undefined,
  status: undefined,
  hierarchies: [],
  arn: undefined,
};

export const DESCRIBE_ASSET_RESPONSE: DescribeAssetResponse = {
  assetId: 'some-asset-id',
  assetName: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetHierarchies: [],
  assetProperties: [],
  assetArn: undefined
};

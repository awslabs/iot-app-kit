import { DescribeAssetModelResponse } from "@aws-sdk/client-iotsitewise";

export const ASSET_MODEL: DescribeAssetModelResponse = {
  assetModelStatus: undefined,
  assetModelId: 'asset-model-id',
  assetModelArn: 'asset-model-arn',
  assetModelName: 'asset model name',
  assetModelDescription: 'some-description',
  assetModelProperties: [],
  assetModelHierarchies: [],
  assetModelCreationDate: new Date(),
  assetModelLastUpdateDate: new Date()
}

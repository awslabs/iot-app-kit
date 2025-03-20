import type { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { AssetState } from '@aws-sdk/client-iotsitewise';

export const ASSET_MODEL = {
  assetModelStatus: undefined,
  assetModelId: 'asset-model-id',
  assetModelArn: 'asset-model-arn',
  assetModelName: 'asset model name',
  assetModelDescription: 'some-description',
  assetModelProperties: [],
  assetModelHierarchies: [],
  assetModelCreationDate: new Date(),
  assetModelLastUpdateDate: new Date(),
} satisfies DescribeAssetModelResponse;
export const ASSET_MODEL_ID = 'assetModelABC123';

export const sampleAssetModel = {
  assetModelId: ASSET_MODEL_ID,
  assetModelName: 'Asset Model Name',
  assetModelDescription: 'a happy little asset model',
  assetModelArn: 'arn:assetModelArn',
  assetModelCreationDate: new Date(2000, 0, 0),
  assetModelLastUpdateDate: new Date(2021, 0, 0),
  assetModelProperties: [],
  assetModelCompositeModels: [],
  assetModelHierarchies: [],
  assetModelStatus: {
    error: {
      code: undefined,
      details: undefined,
      message: undefined,
    },
    state: AssetState.ACTIVE,
  },
} satisfies DescribeAssetModelResponse;

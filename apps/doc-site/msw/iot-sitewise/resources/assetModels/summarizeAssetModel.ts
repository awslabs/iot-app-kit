import { type AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import { type AssetModel } from '../types';

export function summarizeAssetModel(assetModel: AssetModel): AssetModelSummary {
  return {
    arn: assetModel.assetModelArn,
    creationDate: assetModel.assetModelCreationDate,
    description: assetModel.assetModelDescription,
    id: assetModel.assetModelId,
    lastUpdateDate: assetModel.assetModelLastUpdateDate,
    name: assetModel.assetModelName,
    status: assetModel.assetModelStatus,
    assetModelType: assetModel.assetModelType,
  };
}

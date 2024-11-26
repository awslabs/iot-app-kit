import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { type Asset } from '../types';

export function summarizeAsset(asset: Asset) {
  return {
    assetModelId: asset.assetModelId,
    id: asset.assetId,
    name: asset.assetName,
    arn: asset.assetArn,
    status: asset.assetStatus,
    hierarchies: asset.assetHierarchies,
    creationDate: asset.assetCreationDate,
    lastUpdateDate: asset.assetLastUpdateDate,
  } as const satisfies AssetSummary;
}

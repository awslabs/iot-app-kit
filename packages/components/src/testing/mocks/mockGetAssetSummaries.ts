import { AssetSummary } from '@aws-sdk/client-iotsitewise';

export const mockGetAssetSummary = (assetSummary: Partial<AssetSummary> = {}): AssetSummary => ({
  id: 'some-asset-id',
  name: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  creationDate: undefined,
  lastUpdateDate: undefined,
  status: undefined,
  hierarchies: [],
  arn: undefined,
  ...assetSummary,
});

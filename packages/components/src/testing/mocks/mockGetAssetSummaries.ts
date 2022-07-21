import { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';

export const mockGetAssetSummary = (assetSummary: Partial<DescribeAssetResponse> = {}): DescribeAssetResponse => ({
  assetId: 'some-asset-id',
  assetName: 'some-asset-summary-name',
  assetModelId: 'some-asset-model-id',
  assetCreationDate: undefined,
  assetLastUpdateDate: undefined,
  assetStatus: undefined,
  assetHierarchies: [],
  assetArn: undefined,
  assetProperties: [
    {
      id: 'some-property-id',
      name: 'Asset Name',
      dataType: 'DOUBLE',
    },
  ],
  ...assetSummary,
});

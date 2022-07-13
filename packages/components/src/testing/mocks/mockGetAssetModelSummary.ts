import { DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';

export const mockGetAssetModelSummary = (
  assetSummary: Partial<DescribeAssetModelResponse> = {}
): DescribeAssetModelResponse => ({
  assetModelId: 'some-asset-model-id',
  assetModelName: 'some-asset-model-name',
  assetModelDescription: undefined,
  assetModelCreationDate: undefined,
  assetModelLastUpdateDate: undefined,
  assetModelStatus: undefined,
  assetModelHierarchies: [],
  assetModelArn: undefined,
  assetModelProperties: [
    {
      dataType: 'DOUBLE',
      id: 'some-property-id',
      name: 'Asset Name',
      type: undefined,
    },
  ],
  ...assetSummary,
});

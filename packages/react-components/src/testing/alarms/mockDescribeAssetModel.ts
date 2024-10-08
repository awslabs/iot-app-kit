import {
  AssetModelCompositeModel,
  AssetModelProperty,
  DescribeAssetModelResponse,
} from '@aws-sdk/client-iotsitewise';
import { MOCK_ASSET_MODEL_ID } from './mockIds';
import { mockAssetModelProperties } from './mockProperties';

export const mockDescribeAssetModelResponse = ({
  assetModelId = MOCK_ASSET_MODEL_ID,
  compositeModels = [],
  assetModelProperties = mockAssetModelProperties,
}: {
  assetModelId?: string;
  compositeModels?: AssetModelCompositeModel[];
  assetModelProperties?: AssetModelProperty[];
}): DescribeAssetModelResponse => ({
  assetModelId,
  assetModelArn: 'assetModelArn',
  assetModelName: 'assetModelName',
  assetModelDescription: 'assetModelDescription',
  assetModelProperties,
  assetModelHierarchies: [],
  assetModelCreationDate: new Date(),
  assetModelLastUpdateDate: new Date(),
  assetModelStatus: {
    state: 'ACTIVE',
  },
  assetModelCompositeModels: compositeModels,
});

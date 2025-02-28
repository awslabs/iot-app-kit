import {
  type AssetCompositeModel,
  type AssetProperty,
  type DescribeAssetResponse,
} from '@aws-sdk/client-iotsitewise';
import { MOCK_ASSET_ID, MOCK_ASSET_MODEL_ID } from './mockIds';
import { mockAssetProperties } from './mockProperties';

export const mockDescribeAssetResponse = ({
  assetId = MOCK_ASSET_ID,
  compositeModels = [],
  assetProperties = mockAssetProperties,
}: {
  assetId?: string;
  compositeModels?: AssetCompositeModel[];
  assetProperties?: AssetProperty[];
} = {}): DescribeAssetResponse => ({
  assetModelId: MOCK_ASSET_MODEL_ID,
  assetId,
  assetArn: 'assetArn',
  assetName: 'assetName',
  assetProperties,
  assetHierarchies: [],
  assetCreationDate: new Date(),
  assetLastUpdateDate: new Date(),
  assetStatus: {
    state: 'ACTIVE',
  },
  assetCompositeModels: compositeModels,
});

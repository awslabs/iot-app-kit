import { SiteWiseAssetModelQuery } from '@iot-app-kit/source-iotsitewise';

export const createAssetModelQuery = ({
  assetModelId,
  assetId,
  assetModelPropertyIds,
}: {
  assetModelId: string;
  assetModelPropertyIds: string[];
  assetId?: string;
}): SiteWiseAssetModelQuery['assetModels'] => [
  {
    assetModelId: assetModelId,
    assetIds: assetId ? [assetId] : [],
    properties: assetModelPropertyIds.map((propertyId) => ({ propertyId })),
  },
];

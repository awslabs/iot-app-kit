import { SiteWiseAssetModelQuery } from '@iot-app-kit/source-iotsitewise';

export const getAssetModelQueryInformation = (assetModels: SiteWiseAssetModelQuery['assetModels']) => {
  // Current implementation only allows for 1 asset model query and 1 asset model
  const firstAssetModel = assetModels.at(0);

  const assetModelId = firstAssetModel?.assetModelId;
  const assetId = firstAssetModel?.assetIds?.at(0);
  const propertyIds = firstAssetModel?.properties.map(({ propertyId }) => propertyId);
  return {
    assetModelId,
    assetId,
    propertyIds,
  };
};

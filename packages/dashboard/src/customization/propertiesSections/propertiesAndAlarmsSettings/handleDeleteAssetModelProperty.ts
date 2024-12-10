import { type SiteWiseAssetModelQuery } from '@iot-app-kit/source-iotsitewise';
import { type StyledAssetQuery } from '../../../customization/widgets/types';

export const handleRemoveAssetModelProperty = (
  { assetModels }: SiteWiseAssetModelQuery,
  { assetModelId, propertyId }: { assetModelId: string; propertyId: string }
) => {
  return assetModels
    .map((assetModel) => {
      if (assetModel.assetModelId !== assetModelId) return assetModel;
      const { properties } = assetModel;
      return {
        ...assetModel,
        properties: properties.filter(
          (property) => property.propertyId !== propertyId
        ),
      };
    })
    .filter((assetModel) => assetModel.properties.length > 0);
};

export const handleDeleteAssetModelProperty = (
  siteWiseAssetQuery: StyledAssetQuery,
  { assetModelId, propertyId }: { assetModelId: string; propertyId: string }
): StyledAssetQuery => {
  if (!siteWiseAssetQuery) return siteWiseAssetQuery;
  return {
    ...siteWiseAssetQuery,
    assetModels: handleRemoveAssetModelProperty(
      { assetModels: siteWiseAssetQuery.assetModels ?? [] },
      { assetModelId, propertyId }
    ),
  };
};

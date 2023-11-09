import { SiteWiseAssetModelQuery } from '@iot-app-kit/source-iotsitewise';
import { StyledAssetQuery } from '~/customization/widgets/types';

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
        properties: properties.filter((property) => property.propertyId !== propertyId),
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

//handles hide/show in AssetModelProperty

export const handleToggleHideAssetModelProperty = (
  { assetModels = [] }: StyledAssetQuery,
  { assetModelId, propertyId }: { assetModelId: string; propertyId: string }
) => {
  return assetModels
    .map((assetModel) => {
      if (assetModel.assetModelId !== assetModelId) return assetModel;
      const { properties } = assetModel;
      return {
        ...assetModel,
        properties: properties.map((property) => {
          if (property.propertyId === propertyId) {
            const visible = property.visible !== undefined ? !property.visible : false;
            return { ...property, visible };
          } else {
            return property;
          }
        }),
      };
    })
    .filter((assetModel) => assetModel.properties.length > 0);
};

export const handleHideAssetModelProperty = (
  siteWiseAssetQuery: StyledAssetQuery,
  { assetModelId, propertyId }: { assetModelId: string; propertyId: string }
): StyledAssetQuery => {
  if (!siteWiseAssetQuery) return siteWiseAssetQuery;
  return {
    ...siteWiseAssetQuery,
    assetModels: handleToggleHideAssetModelProperty(siteWiseAssetQuery, { assetModelId, propertyId }),
  };
};

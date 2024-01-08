import { StyledAssetQuery } from '../../types';
import { colorerFromStyledQuery } from './defaultColors';

export const applyDefaultStylesToQuery = ({
  assets = [],
  properties = [],
  assetModels = [],
}: StyledAssetQuery) => {
  const assignDefaultColor = colorerFromStyledQuery({
    assets,
    assetModels,
    properties,
  });

  return {
    assets: assets.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) =>
        assignDefaultColor(propertyQuery)
      ),
    })),
    properties: properties.map((property) => assignDefaultColor(property)),
    assetModels: assetModels.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) =>
        assignDefaultColor(propertyQuery)
      ),
    })),
  };
};

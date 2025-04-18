import { type StyledAssetQuery } from '../../types';
import { colorerFromStyledQuery } from './defaultColors';

export const applyDefaultStylesToQuery = ({
  assets = [],
  properties = [],
  assetModels = [],
  alarms = [],
  alarmModels = [],
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
    alarms,
    alarmModels,
  };
};

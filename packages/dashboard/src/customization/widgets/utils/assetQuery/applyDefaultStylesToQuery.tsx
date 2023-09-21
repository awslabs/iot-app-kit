import { assignDefaultColor } from '@iot-app-kit/core-util';
import { StyledAssetPropertyQuery, StyledAssetQuery } from '../../types';

export const applyDefaultStylesToQuery = (siteWiseAssetQuery: StyledAssetQuery) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }, assetIndex) => ({
    ...others,
    properties: properties.map((propertyQuery: StyledAssetPropertyQuery, propIndex) =>
      assignDefaultColor(propertyQuery, assetIndex + propIndex)
    ),
  })),
});

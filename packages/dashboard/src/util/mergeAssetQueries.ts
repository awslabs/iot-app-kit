import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import unionWith from 'lodash-es/unionWith';

export const mergeAssetQueries = (
  currentQueries: SiteWiseAssetQuery['assets'],
  newQuery: SiteWiseAssetQuery['assets'][number]
) => {
  const existingAssetIndex = currentQueries.findIndex(
    (a) => a.assetId === newQuery.assetId
  );
  if (existingAssetIndex >= 0) {
    return [
      ...currentQueries.slice(0, existingAssetIndex),
      {
        ...currentQueries[existingAssetIndex],
        properties: unionWith(
          currentQueries[existingAssetIndex].properties,
          newQuery.properties,
          (a, b) => a.propertyId === b.propertyId
        ),
      },
      ...currentQueries.slice(existingAssetIndex + 1),
    ];
  } else {
    return [...currentQueries, newQuery];
  }
};

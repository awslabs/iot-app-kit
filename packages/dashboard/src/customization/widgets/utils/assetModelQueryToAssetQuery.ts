import {
  AssetModelQuery,
  SiteWiseAssetQuery,
} from '@iot-app-kit/source-iotsitewise';

import unionBy from 'lodash/unionBy';
import uniq from 'lodash/uniq';

import { IoTSiteWiseDataStreamQuery } from '~/types';

type AssetModelQueryWithAssetId = Required<AssetModelQuery>;
const assetModelWithAssetId = (
  assetModelQuery: AssetModelQuery
): assetModelQuery is AssetModelQueryWithAssetId =>
  assetModelQuery.assetIds != null && assetModelQuery.assetIds.length > 0;
const assetModelQueryToAssetQuery = (
  assetModelQuery: AssetModelQueryWithAssetId
) =>
  assetModelQuery.assetIds.map((assetId) => ({
    assetId,
    properties: assetModelQuery.properties,
  }));

const combineAssets = (
  assetsA: SiteWiseAssetQuery['assets'],
  assetsB: SiteWiseAssetQuery['assets']
) => {
  const assetIds = uniq([...assetsA, ...assetsB].map(({ assetId }) => assetId));
  return assetIds.map((assetId) => {
    const foundA = assetsA.find((asset) => asset.assetId === assetId);
    const foundB = assetsB.find((asset) => asset.assetId === assetId);

    if (foundA && foundB) {
      return {
        ...foundA,
        properties: unionBy(foundA.properties, foundB.properties, 'propertyId'),
      };
    }

    // assetIds is the combined list of a and b, one must be defined;
    return (foundA ?? foundB) as SiteWiseAssetQuery['assets'][number];
  });
};

export const assetModelQueryToSiteWiseAssetQuery = ({
  assetModels = [],
  assets = [],
}: Pick<IoTSiteWiseDataStreamQuery, 'assetModels' | 'assets'>) => {
  const assetModelQueriesWithAssetId = assetModels.filter(
    assetModelWithAssetId
  );

  const mappedAssetModelQuery = assetModelQueriesWithAssetId.flatMap(
    assetModelQueryToAssetQuery
  );

  return combineAssets(assets, mappedAssetModelQuery);
};

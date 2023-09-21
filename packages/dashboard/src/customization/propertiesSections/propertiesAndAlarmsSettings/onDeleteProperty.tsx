import { OnDeleteAssetQuery } from './sectionTypes';

export const defaultOnDeleteQuery: OnDeleteAssetQuery =
  ({ assetId, propertyId, siteWiseAssetQuery, updateSiteWiseAssetQuery }) =>
  () => {
    const assets =
      siteWiseAssetQuery?.assets
        .map((asset) => {
          if (assetId === asset.assetId) {
            const { properties } = asset;
            return {
              assetId,
              properties: properties.filter((p) => p.propertyId !== propertyId),
            };
          }
          return asset;
        })
        .filter((asset) => asset.properties.length > 0) ?? [];

    updateSiteWiseAssetQuery({ assets });
  };

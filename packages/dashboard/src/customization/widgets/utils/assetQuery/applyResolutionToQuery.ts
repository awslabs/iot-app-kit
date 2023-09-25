import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

export const applyResolutionToQuery = (siteWiseAssetQuery: SiteWiseAssetQuery, resolution: string | undefined) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      resolution,
    })),
  })),
});

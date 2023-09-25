import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

export const applyAggregationToQuery = (
  siteWiseAssetQuery: SiteWiseAssetQuery,
  aggregationType: AggregateType | undefined
) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      aggregationType,
    })),
  })),
});

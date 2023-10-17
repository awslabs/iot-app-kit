import { type AggregateType } from '@aws-sdk/client-iotsitewise';
import { IoTSiteWiseDataStreamQuery } from '~/types';

export const applyAggregationToQuery = (
  { assets = [], properties = [], assetModels = [] }: IoTSiteWiseDataStreamQuery,
  aggregationType: AggregateType | undefined
) => ({
  assets: assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      aggregationType,
    })),
  })),
  properties: properties.map((propertyQuery) => ({
    ...propertyQuery,
    aggregationType,
  })),
  assetModels: assetModels.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      aggregationType,
    })),
  })),
});

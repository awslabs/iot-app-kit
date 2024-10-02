import { IoTSiteWiseDataStreamQuery } from '~/types';

export const applyResolutionToQuery = (
  {
    assets = [],
    properties = [],
    assetModels = [],
    alarms = [],
    alarmModels = [],
    requestSettings = {},
  }: IoTSiteWiseDataStreamQuery,
  resolution: string | undefined
) => ({
  assets: assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      resolution,
    })),
  })),
  properties: properties.map((propertyQuery) => ({
    ...propertyQuery,
    resolution,
  })),
  assetModels: assetModels.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      resolution,
    })),
  })),
  alarms,
  alarmModels,
  requestSettings: {
    ...requestSettings,
    resolution,
  },
});

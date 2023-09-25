import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

import { v4 as uuid } from 'uuid';

export const assignDefaultRefId = (siteWiseAssetQuery: SiteWiseAssetQuery, getId: () => string = uuid) => ({
  assets: siteWiseAssetQuery.assets.map(({ properties, ...others }) => ({
    ...others,
    properties: properties.map((propertyQuery) => ({
      ...propertyQuery,
      refId: propertyQuery.refId || getId(),
    })),
  })),
});

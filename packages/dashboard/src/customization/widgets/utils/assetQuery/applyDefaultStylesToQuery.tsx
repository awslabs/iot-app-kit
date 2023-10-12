import { assignDefaultColor } from '@iot-app-kit/core-util';
import type { IoTSiteWiseDataStreamQuery } from '~/types';

export const applyDefaultStylesToQuery = ({ assets = [], properties = [] }: IoTSiteWiseDataStreamQuery) => {
  let offset = 0;
  return {
    assets: assets.map(({ properties, ...others }) => ({
      ...others,
      properties: properties.map((propertyQuery) => assignDefaultColor(propertyQuery, offset++)),
    })),
    properties: properties.map((property, propertyIndex) => assignDefaultColor(property, propertyIndex + offset++)),
  };
};

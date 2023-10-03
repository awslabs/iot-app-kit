import { assignDefaultColor } from '@iot-app-kit/core-util';
import type { IoTSiteWiseDataStreamQuery } from '~/types';

export const applyDefaultStylesToQuery = ({ assets = [], properties = [] }: IoTSiteWiseDataStreamQuery) => ({
  assets: assets.map(({ properties, ...others }, assetIndex) => ({
    ...others,
    properties: properties.map((propertyQuery, propIndex) => assignDefaultColor(propertyQuery, assetIndex + propIndex)),
  })),
  properties: properties.map((property, propertyIndex) => assignDefaultColor(property, propertyIndex)),
});

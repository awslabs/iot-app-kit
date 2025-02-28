import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { parseAnomalyEvent } from './parseAnomalyEvent';
import { createNonNullableList } from '@iot-app-kit/core';

export const parseAnomalyEvents = (
  assetPropertyValues: AssetPropertyValue[]
) => {
  return createNonNullableList(assetPropertyValues.map(parseAnomalyEvent));
};

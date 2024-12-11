import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { compact } from '@iot-app-kit/helpers';
import { parseAnomalyEvent } from './parseAnomalyEvent';

export const parseAnomalyEvents = (
  assetPropertyValues: AssetPropertyValue[]
) => {
  return compact(assetPropertyValues.map(parseAnomalyEvent));
};

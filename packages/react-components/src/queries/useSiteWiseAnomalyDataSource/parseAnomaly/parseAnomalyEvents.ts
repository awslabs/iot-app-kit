import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { createNonNullableList } from '../../../utils/createNonNullableList';
import { parseAnomalyEvent } from './parseAnomalyEvent';

export const parseAnomalyEvents = (
  assetPropertyValues: AssetPropertyValue[]
) => {
  return createNonNullableList(assetPropertyValues.map(parseAnomalyEvent));
};

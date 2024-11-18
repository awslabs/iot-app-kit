import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { toTimestamp } from '../../../../../utils/time';

export const assetPropertyValueTime = (
  assetPropertyValue: AssetPropertyValue
) => toTimestamp(assetPropertyValue.timestamp);

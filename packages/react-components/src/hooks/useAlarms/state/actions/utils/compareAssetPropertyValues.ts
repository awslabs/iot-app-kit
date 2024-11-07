import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { assetPropertyValueTime } from './assetPropertyValueTime';

export const compareAssetPropertyValues = (
  a: AssetPropertyValue,
  b: AssetPropertyValue
) => {
  return assetPropertyValueTime(a) - assetPropertyValueTime(b);
};

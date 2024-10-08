import { AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { assetPropertyValueTime } from './assetPropertyValueTime';
import { compareAssetPropertyValues } from './compareAssetPropertyValues';

export const uniqueSortAssetPropertyValues = (
  assetPropertyValues: AssetPropertyValue[]
) => {
  const uniqueMap = new Map<number, AssetPropertyValue>();
  assetPropertyValues.forEach((assetPropertyValue) => {
    const key = assetPropertyValueTime(assetPropertyValue);
    uniqueMap.set(key, assetPropertyValue);
  });
  return Array.from(uniqueMap.values()).sort(compareAssetPropertyValues);
};

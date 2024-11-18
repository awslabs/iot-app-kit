import { type AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { assetPropertyValueTime } from './assetPropertyValueTime';

const assetPropertyValuesAreEqual = (
  a?: AssetPropertyValue,
  b?: AssetPropertyValue
) => {
  return (a && assetPropertyValueTime(a)) === (b && assetPropertyValueTime(b));
};

export const shouldUpdateAssetPropertyValues = (
  currentData: AssetPropertyValue[],
  updatedData: AssetPropertyValue[]
) => {
  return (
    currentData.length !== updatedData.length ||
    !assetPropertyValuesAreEqual(currentData.at(0), updatedData.at(0)) ||
    !assetPropertyValuesAreEqual(currentData.at(-1), updatedData.at(-1))
  );
};

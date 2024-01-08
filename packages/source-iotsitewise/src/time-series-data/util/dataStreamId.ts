import type { AssetId, AssetPropertyId, PropertyAlias } from '../types';

// Something that is not likely to occur in any UUID implementation or propertyAlias
const ID_SEPARATOR = '---';

type PropertyInfo =
  | { assetId: AssetId; propertyId: AssetPropertyId }
  | { propertyAlias: PropertyAlias };

export const toId = (propertyInfo: PropertyInfo): string => {
  if ('assetId' in propertyInfo) {
    return `${propertyInfo.assetId}${ID_SEPARATOR}${propertyInfo.propertyId}`;
  }

  return propertyInfo.propertyAlias;
};

export const fromId = (dataStreamId: string): PropertyInfo => {
  if (!dataStreamId.includes(ID_SEPARATOR)) {
    return { propertyAlias: dataStreamId };
  }

  const [assetId, propertyId] = dataStreamId.split(ID_SEPARATOR);

  return {
    assetId,
    propertyId,
  };
};

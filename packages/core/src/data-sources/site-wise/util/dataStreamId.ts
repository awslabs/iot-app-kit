import { AssetId, AssetPropertyId } from '../types';

// Something that is not likely to occur in any UUID implementation
const ID_SEPARATOR = '---';

export const toDataStreamId = ({ assetId, propertyId }: { assetId: AssetId; propertyId: AssetPropertyId }): string =>
  `${assetId}${ID_SEPARATOR}${propertyId}`;

export const toSiteWiseAssetProperty = (dataStreamId: string): { assetId: AssetId; propertyId: AssetPropertyId } => {
  if (!dataStreamId.includes(ID_SEPARATOR)) {
    throw new Error(`Invalid id ${dataStreamId}, expected to find the separator ${ID_SEPARATOR} but it was not found`);
  }

  const [assetId, propertyId] = dataStreamId.split(ID_SEPARATOR);

  return {
    assetId,
    propertyId,
  };
};

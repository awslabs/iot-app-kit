// Something that is not likely to occur in any UUID implementation
const ID_SEPARATOR = '---';

export const toDataStreamId = ({
  assetId,
  propertyId,
}: {
  assetId: string;
  propertyId: string;
}): string => `${assetId}${ID_SEPARATOR}${propertyId}`;

export const toSiteWiseAssetProperty = (
  dataStreamId: string
): { assetId: string; propertyId: string } => {
  if (!dataStreamId.includes(ID_SEPARATOR)) {
    throw new Error(
      `Invalid id ${dataStreamId}, expected to find the separator ${ID_SEPARATOR} but it was not found`
    );
  }

  const [assetId, propertyId] = dataStreamId.split(ID_SEPARATOR);

  return {
    assetId,
    propertyId,
  };
};

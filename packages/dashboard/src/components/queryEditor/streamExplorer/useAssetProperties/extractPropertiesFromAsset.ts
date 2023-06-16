import { type DescribeAssetCommandOutput } from '@aws-sdk/client-iotsitewise';

/** Grab all of the properties from the given asset. */
export function extractPropertiesFromAsset({
  assetId,
  assetName,
  assetProperties = [],
  assetCompositeModels = [],
}: DescribeAssetCommandOutput) {
  // there may be multiple composite models with their own properties lists
  const compositeProperties = assetCompositeModels.flatMap(({ properties = [] }) => properties);
  const allProperties = [...assetProperties, ...compositeProperties];
  // we add the assetId and assetName to provide consumers of the data with additional context
  const allPropertiesWithAssetDetail = allProperties.map((property) => ({
    assetId,
    assetName,
    ...property,
  }));

  return allPropertiesWithAssetDetail;
}

import {
  type AssetModelPropertySummary,
  type AssetPropertySummary,
} from '@aws-sdk/client-iotsitewise';
import {
  type AssetSummary,
  type PropertySummary,
} from '../../hooks/useAssetDescriptionQueries';

const newMapPropertySummary = ({
  id,
  unit,
  alias,
  path,
  dataType,
}: AssetModelPropertySummary & AssetPropertySummary): PropertySummary => ({
  propertyId: id,
  name: path?.[path.length - 1].name,
  unit,
  dataType,
  alias,
});

const mapListAssetPropertiesToAssetSummary = (
  n: (AssetModelPropertySummary & AssetPropertySummary)[],
  assetId: string,
  assetName: string | undefined
): AssetSummary => {
  return {
    assetId,
    assetName: assetName,
    properties: n.map(newMapPropertySummary) ?? [],
    alarms: [],
  };
};

export const selectListAssetPropertiesMap = (
  data: (AssetModelPropertySummary & AssetPropertySummary)[][]
) =>
  data?.reduce<Record<string, AssetSummary>>((acc, n) => {
    const assetId = n.at(0)?.path?.at(0)?.id;
    if (assetId) {
      const assetName = n.at(0)?.path?.at(0)?.name;
      acc[assetId] = mapListAssetPropertiesToAssetSummary(
        n,
        assetId,
        assetName
      );
    }
    return acc;
  }, {}) ?? {};

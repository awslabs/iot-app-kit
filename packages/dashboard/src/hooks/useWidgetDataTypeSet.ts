import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { useAssetDescriptionMapQuery } from './useAssetDescriptionQueries';
import { isDefined } from '~/util/isDefined';

// hook grabs all the data types of the assets in a SiteWiseAssetQuery
export const useWidgetDataTypeSet = (siteWiseAssetQuery: SiteWiseAssetQuery | undefined): Set<string> => {
  const describedAssetsMapQuery = useAssetDescriptionMapQuery(siteWiseAssetQuery);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const getPropertyType = (assetId: string, propertyId: string) => {
    return (
      describedAssetsMap[assetId]?.properties
        ?.filter((prop) => prop.propertyId === propertyId)
        .map((prop) => prop.dataType) || []
    );
  };

  const dataTypes = siteWiseAssetQuery?.assets
    .map(({ assetId, properties }) => properties.map(({ propertyId }) => getPropertyType(assetId, propertyId)))
    .flat(2) // need to flatten array of assets where each asset has array of properties
    .filter(isDefined);

  return new Set(dataTypes);
};

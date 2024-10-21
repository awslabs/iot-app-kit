import { isDefined } from '~/helpers/isDefined';
import type { IoTSiteWiseDataStreamQuery } from '~/types';
import { useListAssetPropertiesMapQuery } from './useAssetDescriptionQueries';

// hook grabs all the data types of the assets in a SiteWiseAssetQuery
export const useWidgetDataTypeSet = (
  siteWiseQuery: IoTSiteWiseDataStreamQuery | undefined
): Set<string> => {
  const describedAssetsMapQuery = useListAssetPropertiesMapQuery(siteWiseQuery);
  const describedAssetsMap = describedAssetsMapQuery.data ?? {};

  const getPropertyType = (assetId: string, propertyId: string) => {
    return (
      describedAssetsMap[assetId]?.properties
        ?.filter((prop) => prop.propertyId === propertyId)
        .map((prop) => prop.dataType) || []
    );
  };

  const dataTypes =
    siteWiseQuery?.assets
      ?.map(({ assetId, properties }) =>
        properties.map(({ propertyId }) => getPropertyType(assetId, propertyId))
      )
      .flat(2) // need to flatten array of assets where each asset has array of properties
      .filter(isDefined) ?? [];

  return new Set(dataTypes);
};

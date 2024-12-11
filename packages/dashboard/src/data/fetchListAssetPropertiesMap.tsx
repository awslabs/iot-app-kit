import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  type SiteWiseAssetQuery,
  type SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { type QueryClient } from '@tanstack/react-query';
import {
  createFetchSiteWiseAssetQueryDescription,
  createListAssetPropertiesMapCacheKey,
} from './listAssetPropertiesMap/query';
import { selectListAssetPropertiesMap } from './listAssetPropertiesMap/selectData';

export const fetchListAssetPropertiesMap = async (
  siteWiseQuery:
    | Partial<SiteWiseAssetQuery & SiteWisePropertyAliasQuery>
    | undefined,
  queryClient: QueryClient,
  iotSiteWiseClient: IoTSiteWiseClient
) => {
  const queryKey = createListAssetPropertiesMapCacheKey(siteWiseQuery);
  const queryFn = createFetchSiteWiseAssetQueryDescription(
    iotSiteWiseClient,
    siteWiseQuery
  );

  const data = await queryClient.fetchQuery({
    queryKey,
    queryFn,
  });

  return selectListAssetPropertiesMap(data);
};

import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  SiteWiseAssetQuery,
  SiteWisePropertyAliasQuery,
} from '@iot-app-kit/source-iotsitewise';
import { QueryClient } from '@tanstack/react-query';
import {
  createFetchSiteWiseAssetQueryDescription,
  createListAssetPropertiesMapCacheKey,
} from './query';
import { selectListAssetPropertiesMap } from './selectData';

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

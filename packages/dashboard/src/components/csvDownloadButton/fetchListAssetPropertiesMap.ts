import type {
  AssetModelPropertySummary,
  AssetPropertySummary,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import type { QueryClient } from '@tanstack/react-query';
import type {
  IoTSiteWiseDataStreamQuery,
  SiteWiseQueryConfig,
} from '~/features/queries/queries';
import { listAssetPropertiesWithComposite } from '~/hooks/listAssetPropertiesWithAssetDescription';
import type {
  AssetSummary,
  PropertySummary,
} from '~/hooks/useAssetDescriptionQueries';

export const fetchListAssetPropertiesMap = async (
  queryConfig: SiteWiseQueryConfig | undefined,
  queryClient: QueryClient,
  iotSiteWiseClient: IoTSiteWiseClient
) => {
  const queryKey = createQueryKey(queryConfig?.query);
  const queryFn = createQueryFn(iotSiteWiseClient, queryConfig?.query);

  const data = await queryClient.fetchQuery({
    queryKey,
    queryFn,
  });

  return createAssetPropertiesMap(data);
};

const createQueryKey = (
  siteWiseQuery: IoTSiteWiseDataStreamQuery | undefined
): string[] => {
  const cacheKey = ['assetDescriptions', 'listAssetDescriptionsMap'];
  if (!siteWiseQuery?.assets?.length) return cacheKey;

  return [...cacheKey, ...siteWiseQuery.assets.map(({ assetId }) => assetId)];
};

const createQueryFn = (
  iotSiteWiseClient: IoTSiteWiseClient,
  siteWiseQuery: IoTSiteWiseDataStreamQuery | undefined
) => {
  return async () => {
    if (!iotSiteWiseClient || !siteWiseQuery) return [];
    return listPropertiesSiteWiseAssetQuery(
      iotSiteWiseClient,
      siteWiseQuery.assets?.map(({ assetId }) => assetId) ?? []
    );
  };
};

const listPropertiesSiteWiseAssetQuery = async (
  client: IoTSiteWiseClient,
  assetIds: string[]
) => {
  return Promise.all(
    assetIds.map(async (assetId) => {
      try {
        const listAssetProperties = new listAssetPropertiesWithComposite({
          assetId,
          client,
        });

        return await listAssetProperties.send();
      } catch (error) {
        console.error(
          `Error retrieving asset properties for asset ID ${assetId}:`,
          error
        );

        return [];
      }
    })
  );
};

type CombinedPropertySummary = AssetModelPropertySummary & AssetPropertySummary;

const createAssetPropertiesMap = (
  data: CombinedPropertySummary[][]
): Record<string, AssetSummary> => {
  const result: Record<string, AssetSummary> = {};

  for (const properties of data) {
    if (properties.length === 0) continue;

    const assetSummary = createAssetSummary(properties);
    if (assetSummary) {
      result[assetSummary.assetId] = assetSummary;
    }
  }

  return result;
};

const createAssetSummary = (properties: CombinedPropertySummary[]) => {
  const assetPath = properties.at(0)?.path?.at(0);
  if (!assetPath) return null;

  return {
    assetId: assetPath.id ?? '',
    assetName: assetPath.name,
    properties: properties.map(createPropertySummary) ?? [],
    alarms: [],
  } as const satisfies AssetSummary;
};

const createPropertySummary = ({
  id,
  unit,
  alias,
  path,
  dataType,
}: CombinedPropertySummary): PropertySummary => ({
  propertyId: id,
  name: path?.[path.length - 1].name,
  unit,
  dataType,
  alias,
});

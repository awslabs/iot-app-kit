import { useQuery } from '@tanstack/react-query';

import { DescribeAssetCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useClients } from '~/components/dashboard/clientContext';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, mapAssetDescriptionToAssetSummary } from '~/components/resourceExplorer/components/mapper';

const describeAsset = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new DescribeAssetCommand({ assetId }));

const describeSiteWiseAssetQuery = async (client: IoTSiteWiseClient, siteWiseAssetQuery: SiteWiseAssetQuery) =>
  Promise.all(siteWiseAssetQuery.assets.map(({ assetId }) => describeAsset(client, assetId)));

const ASSET_DESCRIPTION_QUERY_KEY = ['assetDescriptions'];

export const useAssetDescriptionMapQuery = (siteWiseAssetQuery: SiteWiseAssetQuery | undefined) => {
  const { iotSiteWiseClient } = useClients();

  const fetchSiteWiseAssetQueryDescription = async () => {
    if (!iotSiteWiseClient || !siteWiseAssetQuery) return;

    return describeSiteWiseAssetQuery(iotSiteWiseClient, siteWiseAssetQuery);
  };

  return useQuery({
    queryKey: [
      ...ASSET_DESCRIPTION_QUERY_KEY,
      'assetDescriptionsMap',
      [...(siteWiseAssetQuery?.assets.map((a) => a.assetId) ?? [])],
    ],
    queryFn: () => fetchSiteWiseAssetQueryDescription(),
    select: (data) =>
      data?.reduce<Record<string, AssetSummary>>((acc, n) => {
        const { assetId } = n;
        if (assetId) {
          acc[assetId] = mapAssetDescriptionToAssetSummary(n);
        }
        return acc;
      }, {}) ?? {},
  });
};

export const useAssetDescriptionQuery = (assetId: string | undefined) => {
  const { iotSiteWiseClient } = useClients();

  const fetchAssetDescription = async () => {
    if (!iotSiteWiseClient || !assetId) return;

    return describeAsset(iotSiteWiseClient, assetId);
  };

  return useQuery({
    queryKey: [...ASSET_DESCRIPTION_QUERY_KEY, assetId],
    queryFn: () => fetchAssetDescription(),
    select: (data) => (data ? mapAssetDescriptionToAssetSummary(data) : data),
    enabled: !!assetId,
  });
};

import { DescribeAssetCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { useEffect, useState } from 'react';
import { useClients } from '~/components/dashboard/clientContext';
import type { DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import type { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

const describeAsset = (client: IoTSiteWiseClient, assetId: string) =>
  client.send(new DescribeAssetCommand({ assetId }));

export const useAssetDescriptionMapAsync = (
  siteWiseAssetQuery: SiteWiseAssetQuery | undefined
): Record<string, DescribeAssetResponse> => {
  const [describedAssets, setDescribedAssets] = useState<Record<string, DescribeAssetResponse>>({});
  const { iotSiteWiseClient } = useClients();

  const fetchAssetDescriptions = async () => {
    if (!iotSiteWiseClient || !siteWiseAssetQuery) return;
    const describedAssetPromises = siteWiseAssetQuery.assets.map(({ assetId }) =>
      describeAsset(iotSiteWiseClient, assetId)
    );

    const describedAssetsList = await Promise.all(describedAssetPromises);
    const map = describedAssetsList.reduce((acc, n) => {
      const { assetId } = n;
      if (assetId) {
        acc[assetId] = n;
      }
      return acc;
    }, {} as Record<string, DescribeAssetResponse>);
    setDescribedAssets(map);
  };

  useEffect(() => {
    fetchAssetDescriptions();
  }, [JSON.stringify(siteWiseAssetQuery)]);

  return describedAssets;
};

export const useAssetDescriptionAsync = (assetId: string | undefined) => {
  const [describedAsset, setDescribedAsset] = useState<DescribeAssetResponse | undefined>(undefined);
  const { iotSiteWiseClient } = useClients();

  const fetchAssetDescription = async () => {
    if (!iotSiteWiseClient || !assetId) return;

    try {
      setDescribedAsset(await describeAsset(iotSiteWiseClient, assetId));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setDescribedAsset(undefined);
    fetchAssetDescription();
  }, [assetId]);

  return describedAsset;
};

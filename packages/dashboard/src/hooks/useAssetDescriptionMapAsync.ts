import { DescribeAssetCommand, DescribeAssetResponse } from '@aws-sdk/client-iotsitewise';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';
import { useContext, useEffect, useState } from 'react';
import { ClientContext } from '~/components/dashboard/clientContext';

export const useAssetDescriptionMapAsync = (
  siteWiseAssetQuery: SiteWiseAssetQuery | undefined
): Record<string, DescribeAssetResponse> => {
  const [describedAssets, setDescribedAssets] = useState<Record<string, DescribeAssetResponse>>({});
  const client = useContext(ClientContext);

  const fetchAssetDescriptions = async () => {
    if (!client || !siteWiseAssetQuery) return;
    const describedAssetPromises = siteWiseAssetQuery.assets.map(({ assetId }) =>
      client.send(new DescribeAssetCommand({ assetId }))
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

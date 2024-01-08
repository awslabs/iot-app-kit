import { toId } from '@iot-app-kit/source-iotsitewise';
import { useQueries } from '@tanstack/react-query';
import { useClients } from '~/components/dashboard/clientContext';
import { AssetCacheKeyFactory } from '~/components/queryEditor/iotSiteWiseQueryEditor/modeledDataStreamQueryEditor/assetExplorer/useAsset/assetCacheKeyFactory';
import { createQueryFn } from '~/components/queryEditor/iotSiteWiseQueryEditor/modeledDataStreamQueryEditor/assetExplorer/useAsset/useAsset';
import { SiteWiseQueryConfig } from '../types';

export const useTableItems = (query: SiteWiseQueryConfig['query']) => {
  const { iotSiteWiseClient } = useClients();

  const assets = query?.assets ?? [];
  const assetIds = assets.map(({ assetId }) => assetId);

  const queries = useQueries({
    queries: iotSiteWiseClient
      ? assetIds.map((assetId) => ({
          enabled: Boolean(assetId),
          queryKey: new AssetCacheKeyFactory(assetId).create(),
          queryFn: createQueryFn(iotSiteWiseClient),
        }))
      : [],
  });

  const assetItems = assets.flatMap(({ assetId, properties }) =>
    properties.map(({ propertyId }) => {
      const assetDescription = queries.find(
        ({ data }) => data?.assetId === assetId
      )?.data;
      const { unit, name } = assetDescription?.assetProperties?.find(
        ({ id }) => id === propertyId
      ) ?? { unit: '' };
      return {
        property: `${name} (${assetDescription?.assetName ?? ''})`,
        unit,
        value: {
          $cellRef: {
            id: toId({
              assetId,
              propertyId,
            }),
            resolution: 0,
          },
        },
      };
    })
  );

  const unmodeledItems =
    query?.properties?.map(({ propertyAlias }) => ({
      property: propertyAlias,
      unit: '',
      value: {
        $cellRef: {
          id: propertyAlias,
          resolution: 0,
        },
      },
    })) ?? [];

  return [...assetItems, ...unmodeledItems];
};

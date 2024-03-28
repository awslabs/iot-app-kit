import {
  type AssetPropertySummary,
  type AssetModelPropertySummary,
  type AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../helpers/paginator';
import type {
  DescribeAsset,
  ListAssetModelProperties,
  ListAssetProperties,
} from '../types/data-source';
import { useAssetModelProperties } from './use-asset-model-properties';
import { useDescribedAssets } from '../asset-explorer/use-assets/use-child-assets/use-asset';

export interface UseAssetPropertiesOptions {
  assetIds: string[];
  listAssetProperties: ListAssetProperties;
  describeAsset?: DescribeAsset;
  listAssetModelProperties?: ListAssetModelProperties;
  pageSize: number;
}

export function useAssetProperties({
  assetIds,
  listAssetProperties,
  describeAsset,
  listAssetModelProperties,
  pageSize,
}: UseAssetPropertiesOptions) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries: assetIds.map((assetId) => ({ assetId })),
  });

  const { assets } = useDescribedAssets({ assetIds, describeAsset });

  const { assetModelProperties, isFetched } = useAssetModelProperties({
    listAssetModelProperties,
    assetModelIds: assets.map(({ assetModelId }) => assetModelId ?? ''),
    pageSize: 250,
  });

  const assetModelPropertyMap = assetModelProperties.reduce<
    Record<string, AssetModelPropertySummary>
  >((acc, curr) => {
    const propertyMap = {
      ...acc,
      [curr.id ?? '']: curr,
    };

    return propertyMap;
  }, {});

  const queryResult = useQuery<AssetProperty[] | AssetPropertySummary[], Error>(
    {
      enabled:
        (listAssetModelProperties != null &&
          describeAsset != null &&
          isFetched) ||
        true,
      refetchOnWindowFocus: false,
      queryKey: createQueryKey(currentQuery),
      queryFn: async () => {
        if (!currentQuery) {
          throw new Error('Expected currentQuery to be defined.');
        }

        const { assetPropertySummaries = [], nextToken } =
          await listAssetProperties(currentQuery ?? {});

        syncPaginator({
          nextToken,
          numberOfResourcesReturned: assetPropertySummaries.length,
        });

        if (assetModelProperties.length === 0) {
          return assetPropertySummaries;
        }

        const assetProperties: AssetProperty[] = assetPropertySummaries.map(
          (assetPropertySummary) => {
            const assetModelProperty: AssetModelPropertySummary | undefined =
              assetModelPropertyMap[assetPropertySummary.id ?? ''];

            if (assetModelProperty) {
              const assetProperty: AssetProperty = {
                id: assetPropertySummary.id,
                path: assetPropertySummary.path,
                notification: assetPropertySummary.notification,
                unit: assetPropertySummary.unit,
                dataType: assetModelProperty?.dataType,
                dataTypeSpec: assetModelProperty?.dataTypeSpec,
                name: assetModelProperty?.name,
              };

              return assetProperty;
            }

            return assetPropertySummary as AssetProperty;
          }
        );

        return assetProperties;
      },
    }
  );

  const queriesData = queryClient.getQueriesData<
    AssetProperty[] | AssetPropertySummary[]
  >([{ resource: 'asset property' }]);

  const assetProperties: AssetProperty[] | AssetPropertySummary[] =
    // @ts-ignore
    queriesData.flatMap(([_, ap = []]) => ap);

  console.log(queryResult);

  return { ...queryResult, assetProperties, hasNextPage, nextPage };
}

function createQueryKey({
  assetId,
  nextToken,
}: {
  assetId?: string;
  nextToken?: string;
} = {}) {
  return [{ resource: 'asset property', assetId, nextToken }] as const;
}

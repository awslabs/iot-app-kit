import {
  type AssetPropertySummary,
  type AssetProperty,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';

import { Paginator } from '../helpers/paginator';
import type {
  DescribeAsset,
  ListAssetModelProperties,
  ListAssetProperties,
} from '../types/data-source';

export interface UseAssetPropertiesOptions {
  assetIds: string[];
  listAssetProperties: ListAssetProperties;
  describeAsset?: DescribeAsset;
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface UseAssetPropertiesResult {
  assetProperties: AssetProperty[] | AssetPropertySummary[];
}

export function useAssetProperties({
  assetIds,
  listAssetProperties,
  describeAsset,
  listAssetModelProperties,
}: UseAssetPropertiesOptions): UseAssetPropertiesResult {
  const queries = useQueries({
    queries: assetIds.map((assetId) => {
      return {
        queryKey: createQueryKey(assetId),
        queryFn: createQueryFn({
          listAssetProperties,
          describeAsset,
          listAssetModelProperties,
        }),
      };
    }),
  });

  const assetProperties = queries.flatMap(
    ({ data = [] }) => data as unknown
  ) as AssetProperty[] | AssetPropertySummary[];
  return { assetProperties };
}

function createQueryKey(assetId: string) {
  return [{ resource: 'Asset property', assetId }] as const;
}

function createQueryFn({
  listAssetProperties,
  describeAsset,
  listAssetModelProperties,
}: {
  listAssetProperties: ListAssetProperties;
  describeAsset?: DescribeAsset;
  listAssetModelProperties?: ListAssetModelProperties;
}) {
  const assetPropertyPaginator = new Paginator(listAssetProperties);
  const assetModelPropertyPaginator =
    listAssetModelProperties != null
      ? new Paginator(listAssetModelProperties)
      : undefined;

  return async function ({
    queryKey: [{ assetId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    const assetPropertyPages = await assetPropertyPaginator.paginate({
      assetId,
    });
    const assetProperties = assetPropertyPages.flatMap(
      ({ assetPropertySummaries = [] }) => assetPropertySummaries
    );

    if (describeAsset != null && listAssetModelProperties != null) {
      const asset = await describeAsset({ assetId });

      if (asset.assetModelId != null) {
        const assetModelPropertyPages =
          await assetModelPropertyPaginator?.paginate({
            assetModelId: asset.assetModelId,
          });

        const assetModelProperties =
          assetModelPropertyPages?.flatMap(
            ({ assetModelPropertySummaries = [] }) =>
              assetModelPropertySummaries
          ) ?? [];

        const combined: AssetProperty[] = assetProperties.map((ap) => {
          const assetModelProperty = assetModelProperties.find(
            (amp) => amp.id === ap.id
          );
          const combo: AssetProperty = {
            id: ap.id,
            dataType: assetModelProperty?.dataType,
            dataTypeSpec: assetModelProperty?.dataTypeSpec,
            path: ap.path,
            notification: ap.notification,
            unit: ap.unit,
            name: assetModelProperty?.name,
          };

          return combo;
        });

        return combined;
      }
    }

    return assetProperties;
  };
}

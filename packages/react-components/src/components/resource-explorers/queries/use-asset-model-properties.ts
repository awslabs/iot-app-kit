import { type AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import {
  useInfiniteQueries,
  type UseInfiniteQueriesResult,
} from '../helpers/use-infinite-queries';
import type { ListAssetModelProperties } from '../types/data-source';

export type UseAssetModelPropertiesQuery = Pick<
  Parameters<ListAssetModelProperties>[0],
  'assetModelId'
>;

export interface UseAssetModelPropertiesOptions {
  queries: UseAssetModelPropertiesQuery[];
  pageSize: number;
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface UseAssetModelPropertiesResult
  extends Omit<UseInfiniteQueriesResult, 'resources'> {
  assetModelProperties: AssetModelPropertySummary[];
}

export function useAssetModelProperties({
  queries,
  pageSize,
  listAssetModelProperties,
}: UseAssetModelPropertiesOptions) {
  const { resources: assetModelProperties, ...queryResult } =
    useInfiniteQueries({
      enabled: Boolean(listAssetModelProperties),
      createQueryKey: (query) => [
        { resource: 'asset model property', ...query },
      ],
      queryFn: async (params) => {
        if (!listAssetModelProperties) {
          throw new Error('Expected ListAssetModelProperties to be defined.');
        }
        const { nextToken, assetModelPropertySummaries: resources = [] } =
          await listAssetModelProperties(params);

        return { nextToken, resources };
      },
      queries,
      pageSize,
    });

  return { assetModelProperties, ...queryResult };
}

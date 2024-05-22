import { type AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import { useQueries } from '@tanstack/react-query';

import { ListAssetModelProperties } from '../../../types/request-fn';
import { resourceExplorerQueryClient } from '../../../requests/resource-explorer-query-client';

export interface UseAssetModelPropertiesOptions {
  assetModelIds: string[];
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface UseAssetModelPropertiesResult {
  assetModelPropertiesById: {
    [assetModelId: string]: AssetModelPropertySummary[];
  };
  isSuccess: boolean;
  error: Error | null;
}

export function useAssetModelProperties({
  assetModelIds,
  listAssetModelProperties,
}: UseAssetModelPropertiesOptions): UseAssetModelPropertiesResult {
  const queries = useQueries(
    {
      queries: assetModelIds.map((assetModelId) => ({
        enabled: listAssetModelProperties !== undefined,
        queryKey: [{ resource: 'AssetModelPropertySummary', assetModelId }],
        queryFn: async () => {
          if (listAssetModelProperties === undefined) {
            throw new Error('Expected listAssetModelProperties to be defined.');
          }

          let currentNextToken: string | undefined = undefined;
          const assetModelPropertySummaries: AssetModelPropertySummary[] = [];

          do {
            const response: Awaited<ReturnType<ListAssetModelProperties>> =
              await listAssetModelProperties({
                assetModelId,
                nextToken: currentNextToken,
                maxResults: 250,
              });

            currentNextToken = response.nextToken;
            assetModelPropertySummaries.push(
              ...(response.assetModelPropertySummaries ?? [])
            );
          } while (currentNextToken);

          return assetModelPropertySummaries;
        },
      })),
    },
    resourceExplorerQueryClient
  );

  const assetModelPropertiesById = assetModelIds.reduce<{
    [assetModelId: string]: AssetModelPropertySummary[];
  }>((acc, prev, index) => {
    const total = {
      ...acc,
      [prev]: queries[index].data ?? [],
    };

    return total;
  }, {});

  const isSuccess = queries.every((query) => query.isSuccess);
  const error: Error | null = (queries.find((query) => query.error)?.error ??
    null) as Error | null;

  return {
    assetModelPropertiesById,
    isSuccess,
    error,
  };
}

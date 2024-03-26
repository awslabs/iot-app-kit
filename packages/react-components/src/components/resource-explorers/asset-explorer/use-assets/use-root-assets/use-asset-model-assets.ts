import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';

import type { ListAssets } from '../../../types/data-source';

export interface UseAssetModelAssetsOptions {
  assetModelIds?: string[];
  listAssets: ListAssets;
}

/** Use the list of assets created from the given asset models. */
export function useAssetModelAssets({
  assetModelIds = [],
  listAssets,
}: UseAssetModelAssetsOptions) {
  const queries = useQueries({
    queries: assetModelIds.map((assetModelId) => {
      return {
        queryKey: createQueryKey(assetModelId),
        queryFn: createQueryFn(listAssets),
      };
    }),
  });

  const assets = queries.flatMap(({ data = [] }) => data);

  return { assets };
}

function createQueryKey(assetModelId: string) {
  const queryKey = [{ resource: 'root asset', assetModelId }] as const;

  return queryKey;
}

function createQueryFn(listAssets: ListAssets) {
  return async function ({
    queryKey: [{ assetModelId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    const assetPaginator = createPaginator(listAssets);
    const assets = await assetPaginator({ assetModelId, signal });

    return assets;
  };
}

function createPaginator(listAssets: ListAssets) {
  async function paginate({
    assetModelId,
    nextToken,
    signal,
  }: {
    assetModelId: string;
    nextToken?: string;
    signal?: AbortSignal;
  }): Promise<AssetSummary[]> {
    const response = await listAssets(
      {
        assetModelId,
        nextToken,
      },
      { abortSignal: signal }
    );

    if (response.nextToken) {
      const nextPage = await paginate({
        assetModelId,
        nextToken: response.nextToken,
        signal,
      });

      return [...(response.assetSummaries ?? []), ...nextPage];
    } else {
      return response.assetSummaries ?? [];
    }
  }

  return paginate;
}

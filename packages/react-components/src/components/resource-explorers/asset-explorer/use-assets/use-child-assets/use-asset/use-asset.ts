import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import type { DescribeAsset } from '../../../../types/data-source';

export interface UseDescribedAssetsOptions {
  assetIds: string[];
  describeAsset?: DescribeAsset;
}

export interface UseDescribedAssetsResult {
  assets: Awaited<ReturnType<DescribeAsset>>[];
}

/** Use an AWS IoT SiteWise asset. */
export function useDescribedAssets({
  assetIds,
  describeAsset,
}: UseDescribedAssetsOptions): UseDescribedAssetsResult {
  const queries = useQueries({
    queries: assetIds.map((assetId) => ({
      enabled: describeAsset != null,
      queryKey: createQueryKey({ assetId }),
      queryFn: createQueryFn(describeAsset),
    })),
  });

  const assets = queries.flatMap(({ data = [] }) => data);

  return { assets };
}

function createQueryKey({ assetId }: { assetId: string }) {
  const queryKey = [{ resource: 'asset', assetId }] as const;

  return queryKey;
}

function createQueryFn(describeAsset?: DescribeAsset) {
  return async function ({
    queryKey: [{ assetId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    if (describeAsset == null) {
      throw new Error('Expected describeAsset to be defined.');
    }
    const asset = await describeAsset({ assetId });

    return asset;
  };
}

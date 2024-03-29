import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import type { DescribeAsset } from '../types/data-source';

export interface UseDescribedAssetsOptions {
  assetIds: string[];
  describeAsset?: DescribeAsset;
}

/** Use IoT SiteWise assets. */
export function useDescribedAssets({
  assetIds,
  describeAsset,
}: UseDescribedAssetsOptions) {
  const queries = useQueries({
    queries: assetIds.map((assetId) => ({
      enabled: isEnabled(),
      queryKey: createQueryKey({ assetId }),
      queryFn: createQueryFn(describeAsset),
    })),
  });

  const assets = queries.flatMap(({ data = [] }) => data);

  return { assets };
}

function isEnabled(
  describeAsset?: DescribeAsset
): describeAsset is DescribeAsset {
  return describeAsset != null;
}

function createQueryKey({ assetId }: { assetId: string }) {
  const queryKey = [{ resource: 'asset', assetId }] as const;

  return queryKey;
}

function createQueryFn(describeAsset?: DescribeAsset) {
  return async function ({
    queryKey: [{ assetId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    if (!isEnabled(describeAsset)) {
      throw new Error('Expected describeAsset to be defined.');
    }

    const asset = await describeAsset({ assetId });

    return asset;
  };
}

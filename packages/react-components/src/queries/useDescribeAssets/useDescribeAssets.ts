import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetCacheKeyFactory } from '../useDescribeAsset/describeAssetQueryKeyFactory';
import { queryClient } from '../queryClient';
import { hasRequestFunction, isAssetId } from '../predicates';
import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { DescribeAsset } from '@iot-app-kit/core';
import { useMemo } from 'react';

export interface UseDescribeAssetsOptions {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
  assetIds?: (string | undefined)[];
}

/**
 * useDescribeAssets is a hook to call IoT SiteWise DescribeAsset on a list of assetIds
 * AssetIds may not be defined in the list, which will disable its query
 *
 * @param client is an AWS SDK IoT SiteWise client
 * @param assetIds is a list of assetIds where IoT SiteWise DescribeAsset API is called on each
 * @returns list of tanstack query results with a DescribeAssetResponse
 */
export function useDescribeAssets({
  iotSiteWiseClient,
  assetIds = [],
}: UseDescribeAssetsOptions) {
  const { describeAsset } = useIoTSiteWiseClient({ iotSiteWiseClient });

  // Memoize the queries to ensure they don't rerun if the same assetIds are used on a rerender
  const queries = useMemo(
    () =>
      assetIds.map((assetId, index) => {
        const cacheKeyFactory = new DescribeAssetCacheKeyFactory({ assetId });
        return {
          enabled: isEnabled({
            assetId: assetIds[index],
            describeAsset,
          }),
          queryKey: cacheKeyFactory.create(),
          queryFn: createQueryFn(describeAsset),
        };
      }),
    [assetIds, describeAsset]
  );

  return useQueries({ queries }, queryClient);
}

// Query is enabled if both an assetId and describeAsset request function is available
const isEnabled = ({
  assetId,
  describeAsset,
}: {
  assetId?: string;
  describeAsset?: DescribeAsset;
}) => isAssetId(assetId) && hasRequestFunction<DescribeAsset>(describeAsset);

// Query function calls describeAsset with the given assetId and request function
const createQueryFn = (describeAsset?: DescribeAsset) => {
  return async ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetCacheKeyFactory['create']>
  >) => {
    invariant(
      hasRequestFunction<DescribeAsset>(describeAsset),
      'Expected client with DescribeAsset to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetId(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    return await describeAsset({ assetId }, { abortSignal: signal });
  };
};

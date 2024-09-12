import { useMemo } from 'react';
import {
  DescribeAssetRequest,
  IoTSiteWise,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { DescribeAsset } from '@iot-app-kit/core';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetCacheKeyFactory } from '../useDescribeAsset/describeAssetQueryKeyFactory';
import { queryClient } from '../queryClient';
import { hasRequestFunction, isAssetId } from '../predicates';
import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { QueryOptionsGlobal } from '../useLatestAssetPropertyValues';

export type UseDescribeAssetsOptions = {
  iotSiteWiseClient?: IoTSiteWiseClient | IoTSiteWise;
  requests?: (DescribeAssetRequest | undefined)[];
} & QueryOptionsGlobal;

/**
 * useDescribeAssets is a hook to call IoT SiteWise DescribeAsset on a list of assetIds
 * AssetIds may not be defined in the list, which will disable its query
 *
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param requests is a list of DescribeAsset requests
 * @returns list of tanstack query results with a DescribeAssetResponse
 */
export function useDescribeAssets({
  iotSiteWiseClient,
  requests = [],
  retry,
}: UseDescribeAssetsOptions) {
  const { describeAsset } = useIoTSiteWiseClient({ iotSiteWiseClient });

  // Memoize the queries to ensure they don't rerun if the same assetIds are used on a rerender
  const queries = useMemo(
    () =>
      requests.map((describeAssetRequest) => {
        const cacheKeyFactory = new DescribeAssetCacheKeyFactory({
          ...describeAssetRequest,
        });
        return {
          enabled: isEnabled({
            assetId: describeAssetRequest?.assetId,
            describeAsset,
          }),
          queryKey: cacheKeyFactory.create(),
          queryFn: createQueryFn(describeAsset),
          retry,
        };
      }),
    [requests, describeAsset, retry]
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

    try {
      return await describeAsset({ assetId }, { abortSignal: signal });
    } catch (error) {
      handleError({ assetId }, error);
    }
  };
};

const handleError = (request: DescribeAssetRequest, error: unknown): never => {
  console.error(`Failed to describe asset. Error: ${error}`);
  console.info('Request input:');
  console.table(request);

  throw error;
};

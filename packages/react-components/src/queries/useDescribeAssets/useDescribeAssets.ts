import { IoTSiteWise, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetCacheKeyFactory } from '../useDescribeAsset/describeAssetQueryKeyFactory';
import { queryClient } from '../queryClient';
import { hasRequestFunction, isAssetId } from '../predicates';
import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { DescribeAsset } from '@iot-app-kit/core';

export interface UseDescribeAssetsOptions {
  client?: IoTSiteWiseClient | IoTSiteWise;
  assetIds?: (string | undefined)[];
}

/** Use an AWS IoT SiteWise asset description. */
export function useDescribeAssets({
  client,
  assetIds = [],
}: UseDescribeAssetsOptions) {
  const { describeAsset } = useIoTSiteWiseClient({ iotSiteWiseClient: client });

  const queryKeys = assetIds.map((assetId) => {
    const cacheKeyFactory = new DescribeAssetCacheKeyFactory({ assetId });
    return cacheKeyFactory.create();
  });

  return useQueries({
    queries: queryKeys.map((queryKey, index) => ({
      enabled: isEnabled({
        assetId: assetIds[index],
        describeAsset: describeAsset,
      }),
      queryKey,
      queryFn: createQueryFn(describeAsset),
    })),
  }, queryClient);
}

const isEnabled = ({
  assetId,
  describeAsset,
}: {
  assetId?: string;
  describeAsset?: DescribeAsset;
}) => isAssetId(assetId) && hasRequestFunction<DescribeAsset>(describeAsset);

const createQueryFn = (describeAsset?: DescribeAsset) => {
  return async ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetCacheKeyFactory['create']>
  >) => {
    invariant(
      hasRequestFunction<DescribeAsset>(describeAsset),
      'Expected client with SiteWise.DescribeAsset to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetId(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    return await describeAsset!({ assetId }, { abortSignal: signal });
  };
};

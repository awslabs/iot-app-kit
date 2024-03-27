import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetCacheKeyFactory } from './describeAssetQueryKeyFactory';
import { GetDescribeAssetRequest } from './getDescribeAssetRequest';

export interface UseDescribeAssetOptions {
  client: IoTSiteWiseClient;
  assetId?: string;
}

/** Use an AWS IoT SiteWise asset description. */
export function useDescribeAsset({ client, assetId }: UseDescribeAssetOptions) {
  const cacheKeyFactory = new DescribeAssetCacheKeyFactory({ assetId });

  return useQuery({
    enabled: isEnabled(assetId),
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
  });
}

const isEnabled = (assetId?: string): assetId is string => Boolean(assetId);

const createQueryFn = (client: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetCacheKeyFactory['create']>
  >) => {
    invariant(
      isEnabled(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    const request = new GetDescribeAssetRequest({
      assetId,
      client,
      signal,
    });

    const response = await request.send();

    return response;
  };
};

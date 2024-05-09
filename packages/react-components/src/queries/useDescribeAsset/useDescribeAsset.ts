import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetCacheKeyFactory } from './describeAssetQueryKeyFactory';
import { GetDescribeAssetRequest } from './getDescribeAssetRequest';
import { queryClient } from '../queryClient';
import { hasClient, isAssetId } from '../predicates';

export interface UseDescribeAssetOptions {
  client?: IoTSiteWiseClient;
  assetId?: string;
}

/** Use an AWS IoT SiteWise asset description. */
export function useDescribeAsset({ client, assetId }: UseDescribeAssetOptions) {
  const cacheKeyFactory = new DescribeAssetCacheKeyFactory({ assetId });

  return useQuery(
    {
      enabled: isEnabled({ assetId, client }),
      queryKey: cacheKeyFactory.create(),
      queryFn: createQueryFn(client),
    },
    queryClient
  );
}

const isEnabled = ({
  assetId,
  client,
}: {
  assetId?: string;
  client?: IoTSiteWiseClient;
}) => isAssetId(assetId) && hasClient(client);

const createQueryFn = (client?: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetCacheKeyFactory['create']>
  >) => {
    invariant(
      hasClient(client),
      'Expected client to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetId(assetId),
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

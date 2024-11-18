import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { type QueryFunctionContext, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetPropertyCacheKeyFactory } from './describeAssetPropertyQueryKeyFactory';
import { GetDescribeAssetPropertyRequest } from './getDescribeAssetPropertyRequest';
import { queryClient } from '../queryClient';
import { hasClient, isAssetId, isPropertyId } from '../predicates';

export interface UseDescribeAssetPropertyOptions {
  client?: IoTSiteWiseClient;
  assetId?: string;
  propertyId?: string;
}

/** Use an AWS IoT SiteWise asset description. */
export function useDescribeAssetProperty({
  client,
  assetId,
  propertyId,
}: UseDescribeAssetPropertyOptions) {
  const cacheKeyFactory = new DescribeAssetPropertyCacheKeyFactory({
    assetId,
    propertyId,
  });

  return useQuery(
    {
      enabled: isDescribeAssetPropertyEnabled({ client, assetId, propertyId }),
      queryKey: cacheKeyFactory.create(),
      queryFn: createDescribeAssetPropertyQueryFn(client),
    },
    queryClient
  );
}

export const isDescribeAssetPropertyEnabled = ({
  client,
  assetId,
  propertyId,
}: {
  client?: IoTSiteWiseClient;
  assetId?: string;
  propertyId?: string;
}) => hasClient(client) && isAssetId(assetId) && isPropertyId(propertyId);

export const createDescribeAssetPropertyQueryFn = (
  client?: IoTSiteWiseClient
) => {
  return async ({
    queryKey: [{ assetId, propertyId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetPropertyCacheKeyFactory['create']>
  >) => {
    invariant(
      hasClient(client),
      'Expected client to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetId(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    invariant(
      isPropertyId(propertyId),
      'Expected propertyId to be defined as required by the enabled flag.'
    );

    const request = new GetDescribeAssetPropertyRequest({
      assetId,
      propertyId,
      client,
      signal,
    });

    const response = await request.send();

    return response;
  };
};

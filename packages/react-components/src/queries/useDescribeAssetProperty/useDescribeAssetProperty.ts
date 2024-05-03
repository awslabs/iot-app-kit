import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { DescribeAssetPropertyCacheKeyFactory } from './describeAssetPropertyQueryKeyFactory';
import { GetDescribeAssetPropertyRequest } from './getDescribeAssetPropertyRequest';
import { queryClient } from '../queryClient';

export interface UseDescribeAssetPropertyOptions {
  client: IoTSiteWiseClient;
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
      enabled: isDescribeAssetPropertyEnabled({ assetId, propertyId }),
      queryKey: cacheKeyFactory.create(),
      queryFn: createDescribeAssetPropertyQueryFn(client),
    },
    queryClient
  );
}

const isAssetId = (assetId?: string): assetId is string => Boolean(assetId);

const isPropertyId = (propertyId?: string): propertyId is string =>
  Boolean(propertyId);

export const isDescribeAssetPropertyEnabled = ({
  assetId,
  propertyId,
}: {
  assetId?: string;
  propertyId?: string;
}) => isAssetId(assetId) && isPropertyId(propertyId);

export const createDescribeAssetPropertyQueryFn = (
  client: IoTSiteWiseClient
) => {
  return async ({
    queryKey: [{ assetId, propertyId }],
    signal,
  }: QueryFunctionContext<
    ReturnType<DescribeAssetPropertyCacheKeyFactory['create']>
  >) => {
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

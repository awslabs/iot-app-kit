import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { AssetModelPropertiesCacheKeyFactory } from './assetModelPropertiesQueryKeyFactory';
import { GetAssetModelPropertiesRequest } from './getAssetModelPropertiesRequest';
import invariant from 'tiny-invariant';

export interface UseAssetModelProperties {
  client: IoTSiteWiseClient;
  assetModelId: string;
}

/** Use an AWS IoT SiteWise asset description. */
export function useAssetModelProperties({ assetModelId, client }: UseAssetModelProperties) {
  const cacheKeyFactory = new AssetModelPropertiesCacheKeyFactory(assetModelId);

  const {
    data: { pages: assetModelPropertyResponses = [] } = {},
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    enabled: isEnabled(assetModelId),
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
    staleTime: Infinity,
  });

  // if (hasNextPage) fetchNextPage();

  const assetModelPropertySummaries = createNonNullableList(
    assetModelPropertyResponses.flatMap((res) => res.assetModelPropertySummaries)
  );

  return {
    assetModelPropertySummaries,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
    isLoading,
  };
}

const isEnabled = (assetModelId?: string): assetModelId is string => Boolean(assetModelId);

export const createQueryFn = (client: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetModelId }],
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<AssetModelPropertiesCacheKeyFactory['create']>>) => {
    invariant(isEnabled(assetModelId), 'Expected assetModelId to be defined as required by the enabled flag.');

    const request = new GetAssetModelPropertiesRequest({ assetModelId, nextToken, client, signal });

    const response = await request.send();

    return response;
  };
};

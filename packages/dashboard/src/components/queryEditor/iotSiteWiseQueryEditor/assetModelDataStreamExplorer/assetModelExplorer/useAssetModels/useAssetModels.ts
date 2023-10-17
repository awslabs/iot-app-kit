import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { AssetModelsCacheKeyFactory } from './assetModelQueryKeyFactory';
import { GetAssetModelsRequest } from './getAssetModelRequest';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';

export interface UseAssetModelsOptions {
  client: IoTSiteWiseClient;
  fetchAll?: boolean;
}

/** Use an AWS IoT SiteWise asset description. */
export function useAssetModels({ client, fetchAll }: UseAssetModelsOptions) {
  const cacheKeyFactory = new AssetModelsCacheKeyFactory();

  const {
    data: { pages: assetModelResponses = [] } = {},
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
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  if (fetchAll && hasNextPage) fetchNextPage();

  const assetModelSummaries = createNonNullableList(assetModelResponses.flatMap((res) => res.assetModelSummaries));

  return {
    assetModelSummaries,
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

export const createQueryFn = (client: IoTSiteWiseClient) => {
  return async ({
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<AssetModelsCacheKeyFactory['create']>>) => {
    const request = new GetAssetModelsRequest({ nextToken, client, signal });

    const response = await request.send();

    return response;
  };
};

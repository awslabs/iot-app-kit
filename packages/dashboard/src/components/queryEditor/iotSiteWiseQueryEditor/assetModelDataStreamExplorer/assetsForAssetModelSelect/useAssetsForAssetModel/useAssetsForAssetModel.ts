import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';
import { AssetsForAssetModelCacheKeyFactory } from './assetsForAssetModelQueryKeyFactory';
import invariant from 'tiny-invariant';
import { GetAssetsForAssetModelRequest } from './getAssetsForAssetModelRequest';

export interface UseAssetModelsOptions {
  client: IoTSiteWiseClient;
  assetModelId?: string;
  fetchAll?: boolean;
}

/** Use an AWS IoT SiteWise asset description. */
export function useAssetsForAssetModel({ client, assetModelId, fetchAll }: UseAssetModelsOptions) {
  const cacheKeyFactory = new AssetsForAssetModelCacheKeyFactory(assetModelId);

  const {
    data: { pages: assetsResponses = [] } = {},
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
  });

  if (fetchAll && hasNextPage) fetchNextPage();

  const assetSummaries = createNonNullableList(assetsResponses.flatMap((res) => res.assetSummaries));

  return {
    assetSummaries,
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

export const isEnabled = (assetModelId?: string): assetModelId is string => Boolean(assetModelId);

export const createQueryFn = (client: IoTSiteWiseClient) => {
  return async ({
    queryKey: [{ assetModelId }],
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<AssetsForAssetModelCacheKeyFactory['create']>>) => {
    invariant(isEnabled(assetModelId), 'Expected assetModelId to be defined as required by the enabled flag.');

    const request = new GetAssetsForAssetModelRequest({ assetModelId, nextToken, client, signal });

    const response = await request.send();

    return response;
  };
};

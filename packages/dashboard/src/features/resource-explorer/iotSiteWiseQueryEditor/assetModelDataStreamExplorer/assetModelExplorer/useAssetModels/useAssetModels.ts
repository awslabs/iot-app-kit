import {
  AssetModelSummary,
  AssetModelType,
  IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import { createNonNullableList } from '~/helpers/lists';
import { AssetModelsCacheKeyFactory } from './assetModelQueryKeyFactory';
import { GetAssetModelsRequest } from './getAssetModelRequest';

export interface UseAssetModelsOptions {
  client: IoTSiteWiseClient;
  fetchAll?: boolean;
  includeComposite?: boolean;
}

/** Use an AWS IoT SiteWise asset description. */
export function useAssetModels({
  client,
  fetchAll,
  includeComposite = true,
}: UseAssetModelsOptions) {
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

  let assetModelSummaries = createNonNullableList(
    assetModelResponses.flatMap((res) => res.assetModelSummaries)
  );

  if (!includeComposite) {
    // Remove composite models
    assetModelSummaries = assetModelSummaries.filter(
      (modelSummary: AssetModelSummary) =>
        modelSummary.assetModelType !== AssetModelType.COMPONENT_MODEL
    );
  }

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
  }: QueryFunctionContext<
    ReturnType<AssetModelsCacheKeyFactory['create']>
  >) => {
    const request = new GetAssetModelsRequest({ nextToken, client, signal });

    const response = await request.send();

    return response;
  };
};
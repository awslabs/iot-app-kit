import {
  type AssetModelSummary,
  AssetModelType,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import {
  type QueryFunctionContext,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { AssetModelsCacheKeyFactory } from './assetModelQueryKeyFactory';
import { GetAssetModelsRequest } from './getAssetModelRequest';
import { createNonNullableList } from '~/helpers/lists/createNonNullableList';

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
    initialPageParam: undefined,
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
    const request = new GetAssetModelsRequest({
      nextToken: nextToken as string,
      client,
      signal,
    });

    const response = await request.send();

    return response;
  };
};

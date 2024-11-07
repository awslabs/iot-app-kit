import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import {
  type QueryFunctionContext,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { ListUnmodeledDataStreamsRequest } from './listUnmodeledDataStreamsRequest';
import { UnmodeledDataStreamCacheKeyFactory } from './unmodeledDataStreamCacheKeyFactory';

export interface UseUnmodeledDataStreamsOptions {
  aliasPrefix?: string;
  client: IoTSiteWiseClient;
}

export function useUnmodeledDataStreams({
  aliasPrefix,
  client,
}: UseUnmodeledDataStreamsOptions) {
  const cacheKeyFactory = new UnmodeledDataStreamCacheKeyFactory(aliasPrefix);

  const {
    data: { pages: unmodeledDataStreamPages = [] } = {},
    hasNextPage,
    fetchNextPage,
    status,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
    initialPageParam: undefined,
  });

  const unmodeledDataStreams = combinePages(unmodeledDataStreamPages);

  return {
    unmodeledDataStreams,
    hasNextPage,
    isFetching,
    fetchNextPage,
    status,
    error,
  };
}

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ aliasPrefix }],
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<
    ReturnType<UnmodeledDataStreamCacheKeyFactory['create']>
  >) {
    const request = new ListUnmodeledDataStreamsRequest({
      aliasPrefix,
      nextToken: nextToken as string,
      client,
      signal,
    });
    const response = await request.send();

    return response;
  };
}

function combinePages(
  pages: Awaited<ReturnType<ListUnmodeledDataStreamsRequest['send']>>[]
) {
  const combinedPages = pages.flatMap(
    ({ unmodeledDataStreams }) => unmodeledDataStreams ?? []
  );

  return combinedPages;
}

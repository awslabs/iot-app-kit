import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';

import { search } from './search';
import { IoTTwinMakerClient } from '@aws-sdk/client-iottwinmaker';
import { QueryResponseProcessor } from './queryResponseProcessor';

const TWIN_MAKER_CACHE_KEY = [{ service: 'iottwinmaker' }] as const;

const CACHE_KEYS = {
  all: [{ ...TWIN_MAKER_CACHE_KEY[0], scope: 'search' }] as const,
  searches: () => [{ ...CACHE_KEYS.all[0], resource: 'searches' }] as const,
  search: ({ workspaceId, searchQuery }: { workspaceId: string; searchQuery: string }) =>
    [{ ...CACHE_KEYS.searches()[0], workspaceId, searchQuery }] as const,
};

interface UseSearchProps {
  workspaceId: string;
  searchQuery: string;
  client: IoTTwinMakerClient;
}

/** Use to send a search request. */
export function useSearch({ workspaceId, searchQuery, client }: UseSearchProps) {
  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery({
    enabled: searchQuery !== '',
    queryKey: CACHE_KEYS.search({ workspaceId, searchQuery }),
    queryFn: createQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const modeledDataStreams = data?.pages.flatMap(({ modeledDataStreams }) => modeledDataStreams) ?? [];

  return { modeledDataStreams, hasNextPage, isFetching, fetchNextPage };
}

function createQueryFn(client: IoTTwinMakerClient) {
  return async function ({
    queryKey: [{ workspaceId, searchQuery }],
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<typeof CACHE_KEYS.search>>) {
    const response = await search({ workspaceId, searchQuery, nextToken, client, signal });

    const modeledDataStreams = QueryResponseProcessor.process(response);

    return { modeledDataStreams, nextToken: response.nextToken };
  };
}

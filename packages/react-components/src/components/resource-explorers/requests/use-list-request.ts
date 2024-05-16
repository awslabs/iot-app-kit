import { useInfiniteQuery } from '@tanstack/react-query';

import { DEFAULT_REQUEST_TIMEOUT } from '../constants/defaults';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';
import type {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseListAPIBaseResult,
  UseListRequestOptions,
} from '../types/requests';

export interface UseListRequestResult<Resource> extends UseListAPIBaseResult {
  resources: Resource[];
}

/** Use to request paginated resources. */
export function useListRequest<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
>({
  pageSize,
  resourceId,
  parameters,
  requestFn,
  responseTransformer,
  isEnabled = true,
}: UseListRequestOptions<
  Params,
  Response,
  Resource
>): UseListRequestResult<Resource> {
  const queryKey = [{ resourceId, pageSize, ...parameters }];

  const {
    data: { pages: responses = [] } = {},
    isFetching: isLoading,
    hasNextPage = false,
    fetchNextPage,
    error,
  } = useInfiniteQuery(
    {
      enabled: requestFn != null && isEnabled,
      refetchOnWindowFocus: false,
      queryKey,
      queryFn: async ({ pageParam: nextToken, signal }): Promise<Response> => {
        try {
          if (!requestFn) {
            throw new Error('Expected requestFn to be defined.');
          }

          const request: Params = {
            ...parameters,
            nextToken: Boolean(nextToken) ? nextToken : undefined,
            maxResults: pageSize,
          } as Params;
          const response = await requestFn(request, {
            abortSignal: signal,
            requestTimeout: DEFAULT_REQUEST_TIMEOUT,
          });

          return response;
        } catch (error) {
          console.error('Failed to request resources.', error);

          throw error;
        }
      },
      initialPageParam: '',
      getNextPageParam: ({ nextToken }) => nextToken,
    },
    resourceExplorerQueryClient
  );

  function nextPage() {
    // Calling fetchNextPage will bypass the useInfinitQuery isEnabled option
    if (requestFn != null && isEnabled) {
      fetchNextPage();
    }
  }

  const resources = responses.flatMap(responseTransformer);

  return {
    resources,
    isLoading,
    hasNextPage,
    nextPage,
    error,
  };
}

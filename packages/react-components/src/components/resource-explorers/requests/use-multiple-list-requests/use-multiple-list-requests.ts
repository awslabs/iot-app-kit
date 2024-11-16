import {
  useQueries,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDeepCompareEffect, useUpdate } from 'react-use';
import { DEFAULT_REQUEST_TIMEOUT } from '../../constants/defaults';
import type {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseListAPIBaseResult,
  UseListRequestParams,
  UseMultipleListRequestsOptions,
} from '../../types/requests';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';

type QueryKey<Params extends ListRequestBaseParams> = readonly [
  {
    resourceId: string;
    parameterSet: UseListRequestParams<Params>;
    nextToken: string | undefined;
  }
];

interface ResourceResponse<Resource> {
  resources: Resource[];
  nextToken: string | undefined;
}

export interface UseMultipleListRequestsResult<Resource>
  extends UseListAPIBaseResult {
  resources: Resource[];
}

/** Use paginated resources across multiple queries. */
export function useMultipleListRequests<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
>({
  pageSize,
  parameters = [],
  requestFn,
  resourceId,
  responseTransformer: resourceSelector,
  isEnabled,
}: UseMultipleListRequestsOptions<
  Params,
  Response,
  Resource
>): UseMultipleListRequestsResult<Resource> {
  // this is a hack to solve an unknown render bug preventing re-render of the
  // hook after data is returned
  const update = useUpdate();
  useDeepCompareEffect(() => {
    update();
  }, [parameters]);

  // new query keys are generated each time a page is loaded to enable streaming pagination.
  // parameter sets are grouped to keep ordering of table during streaming
  const queryKeys = parameters.flatMap((parameterSet) => {
    const queryData = resourceExplorerQueryClient.getQueriesData<
      ResourceResponse<Resource>
    >({ queryKey: [{ resourceId, parameterSet }] }) as [
      QueryKey<Params>,
      ResourceResponse<Resource> | undefined
    ][];

    const alreadyRequestedQueryKeys = queryData.flatMap(
      (queryData) => queryData[0]
    );
    const lastPageLoaded = queryData
      .at(-1)
      ?.at(1) as ResourceResponse<Resource>;
    const updatedQueryKeys =
      alreadyRequestedQueryKeys.length === 0
        ? [{ resourceId, parameterSet, nextToken: undefined }]
        : lastPageLoaded != null && lastPageLoaded.nextToken != null
        ? [
            ...alreadyRequestedQueryKeys,
            { resourceId, parameterSet, nextToken: lastPageLoaded.nextToken },
          ]
        : alreadyRequestedQueryKeys;

    return updatedQueryKeys;
  });

  const { resources, isLoadingFirstPage, isLoadingResources, error } =
    useQueries(
      {
        combine: useCallback(
          (results: UseQueryResult<ResourceResponse<Resource>, Error>[]) => {
            const resultWithError = results.find(
              (result) => result.error != null
            );

            return {
              resources: results.flatMap(
                (result) => result.data?.resources ?? []
              ),
              isLoadingFirstPage: results.at(0)?.isLoading ?? false,
              isLoadingResources: results.some((result) => result.isFetching),
              error: resultWithError ? resultWithError.error : null,
            };
          },
          []
        ),
        queries: queryKeys.map<
          UseQueryOptions<
            ResourceResponse<Resource>,
            Error,
            ResourceResponse<Resource>,
            QueryKey<Params>
          >
        >((queryKey) => ({
          enabled: parameters.length > 0 && requestFn != null && isEnabled,
          queryKey: [queryKey],
          queryFn: async ({ queryKey, signal }) => {
            try {
              if (!requestFn) {
                throw new Error('Exected requestFn to be defined.');
              }

              const response = await requestFn(
                {
                  ...queryKey[0].parameterSet,
                  nextToken: queryKey[0].nextToken,
                  maxResults: pageSize,
                } as Params,
                {
                  abortSignal: signal,
                  requestTimeout: DEFAULT_REQUEST_TIMEOUT,
                }
              );

              const resources = resourceSelector(response);

              return { resources, nextToken: response.nextToken };
            } catch (error) {
              console.error('Failed to request resources.', error);

              throw error;
            }
          },
        })),
      },
      resourceExplorerQueryClient
    );

  return {
    resources,
    isLoadingFirstPage,
    isLoadingResources,
    error,
  };
}

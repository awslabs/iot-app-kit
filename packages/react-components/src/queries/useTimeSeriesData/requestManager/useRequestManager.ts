import { useQueries } from '@tanstack/react-query';
import zip from 'lodash-es/zip';
import { useCallback, useMemo } from 'react';
import { createNonNullableTupleList } from '../../../utils/createNonNullableList';
import { type TimeSeriesDataCacheClient } from '../cacheClient';
import { type Viewport } from '../types';
import { type RequestResolverStrategy, type RequestSettings } from './types';

type TimeSeriesDataRequestManagerOptions<Request, Data> = {
  requests: Request[];
  viewport: Viewport;
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
  settings: RequestSettings;
  requestResolver: RequestResolverStrategy<Request>;
};

export const useTimeSeriesDataRequestManager = <Request, Data>({
  cacheClient,
  requests,
  viewport,
  settings,
  requestResolver,
}: TimeSeriesDataRequestManagerOptions<Request, Data>) => {
  const createQueryFn = useCallback(
    (request: Request) => {
      return async () => {
        return requestResolver.resolve({ request, viewport }, settings);
      };
    },
    [requestResolver, viewport, settings]
  );

  const queries = useMemo(() => {
    return requests.map((request) => ({
      gcTime: 100,
      queryKey: cacheClient
        .getKeyManager()
        .toRequestQueryKey(request, viewport),
      queryFn: createQueryFn(request),
    }));
  }, [requests, cacheClient, viewport, createQueryFn]);

  const requestQueries = useQueries(
    {
      queries,
    },
    cacheClient.getQueryClient()
  );

  return useMemo(() => {
    const zipped = createNonNullableTupleList(zip(requests, requestQueries));

    return zipped.map(([queryRequest, queryResult]) => ({
      queryRequest,
      queryResult,
    }));
  }, [requests, requestQueries]);
};

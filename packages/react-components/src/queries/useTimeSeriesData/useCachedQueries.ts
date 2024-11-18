import { useMemo } from 'react';
import { type TimeSeriesDataCacheClient } from './cacheClient';
// import { Viewport } from "./types";
import { useQueries } from '@tanstack/react-query';
// import { IntervalTransformer } from "./intervals";

type UseCachcedQueriesOptions<Request, Data> = {
  requests: Request[];
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
};
export const useTimeSeriesDataCachedQueries = <Request, Data>({
  requests,
  cacheClient,
}: UseCachcedQueriesOptions<Request, Data>) => {
  const queries = useMemo(() => {
    return requests.map((request) => {
      return {
        queryKey: cacheClient
          .getKeyManager()
          .toCachedRequestExectutionQueryKey(request),
        queryFn: async () => {
          return (
            cacheClient.getCachedTimeSeriesDataRequestIntervals(request) ?? []
          );
        },
        select: () => {
          return {
            request,
            cachedQueries:
              cacheClient.getCachedTimeSeriesDataRequestIntervals(request),
          };
        },
        gcTime: 5000,
      };
    });
  }, [requests, cacheClient]);

  return useQueries(
    {
      queries,
    },
    cacheClient.getQueryClient()
  );
};

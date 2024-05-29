import { useMemo } from 'react';
import { TimeSeriesDataCacheClient } from './cacheClient';
import { Viewport } from './types';
import { useQueries } from '@tanstack/react-query';
// import { IntervalTransformer } from "./intervals";

type UseBisectedDataOptions<Request, Data> = {
  requests: Request[];
  viewport: Viewport;
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
};
export const useTimeSeriesBisectedData = <Request, Data>({
  requests,
  viewport,
  cacheClient,
}: UseBisectedDataOptions<Request, Data>) => {
  const queries = useMemo(() => {
    return requests.map((request) => {
      return {
        queryKey: cacheClient.getKeyManager().toDataCacheQueryKey(request),
        queryFn: async () => {
          return cacheClient.getTimeSeriesData({ request, viewport }) ?? [];
        },
        select: () => {
          return {
            request,
            data: cacheClient.getTimeSeriesData({ request, viewport }),
          };
        },
        gcTime: 5000,
      };
    });
  }, [requests, viewport, cacheClient]);

  return useQueries(
    {
      queries,
    },
    cacheClient.getQueryClient()
  );
};

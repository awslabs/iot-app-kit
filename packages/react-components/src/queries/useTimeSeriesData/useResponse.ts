import { useMemo } from 'react';
import { type TimeSeriesDataCacheClient } from './cacheClient';
import { type useTimeSeriesBisectedData } from './useBisectedData';
import { type useTimeSeriesDataRequestStatus } from './useRequestStatus';

export type UseTimeSeriesDataResponseOptions<Request, Data> = {
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
  dataQueries: ReturnType<typeof useTimeSeriesBisectedData<Request, Data>>;
  statuses: ReturnType<typeof useTimeSeriesDataRequestStatus<Request, Data>>;
};

export const useTimeSeriesDataResponse = <Request, Data>({
  cacheClient,
  dataQueries,
  statuses,
}: UseTimeSeriesDataResponseOptions<Request, Data>) => {
  return useMemo(() => {
    return statuses.map(({ queryRequest, status }) => {
      const data =
        dataQueries.find((query) => {
          const request = query.data?.request;
          if (!request) return false;
          return cacheClient.matchesRequest(request, queryRequest);
        })?.data?.data ?? [];

      return {
        request: queryRequest,
        status,
        data,
      };
    });
  }, [cacheClient, statuses, dataQueries]);
};

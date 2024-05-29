import { useCallback, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { TimeSeriesDataCacheClient } from './cacheClient';
import { Viewport } from './types';
import {
  IntervalTransformer,
  LIVE_DATA_INTERVALS,
  getViewportType,
  resolve,
} from './intervals';

type TimeSeriesDataRequestManagerOptions<Request, Data> = {
  requests: Request[];
  viewport: Viewport;
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
};

export const useTimeSeriesDataRequestManager = <Request, Data>({
  cacheClient,
  requests,
  viewport,
}: TimeSeriesDataRequestManagerOptions<Request, Data>) => {
  const createQueryFn = useCallback(
    (request: Request) => {
      return async () => {
        const viewportType = getViewportType(viewport);
        const now = Date.now();

        const intervalTransformer = new IntervalTransformer({
          now,
          viewportType,
        });

        cacheClient.cancelTimeSeriesDataRequests(
          { request, viewport },
          { intervalTransformer, status: 'pending' }
        );

        const existingTimeSeriesDataRequestViewports =
          cacheClient.getTimeSeriesDataRequestViewports(
            { request, viewport },
            { intervalTransformer, status: 'success' }
          );

        const completeViewports = resolve({
          viewport,
          existingViewports: existingTimeSeriesDataRequestViewports,
          // Late data intervals are not configurable currently
          liveDataViewports: LIVE_DATA_INTERVALS,
          intervalTransformer,
        });

        return completeViewports.map((v) => ({
          request,
          viewport: v,
        }));
      };
    },
    [viewport, cacheClient]
  );

  const queries = useMemo(() => {
    return requests.map((request) => ({
      gcTime: 100,
      queryKey: cacheClient
        .getKeyManager()
        .toRequestQueryKey(request, viewport),
      queryFn: createQueryFn(request),
    }));
  }, [requests, cacheClient, createQueryFn, viewport]);

  return useQueries(
    {
      queries,
    },
    cacheClient.getQueryClient()
  );
};

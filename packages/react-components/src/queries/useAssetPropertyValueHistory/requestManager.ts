import { useQueries } from '@tanstack/react-query';
import { AssetPropertyValueHistoryDataCache } from './assetPropertyValueHistoryCache';
import {
  collapseRequests,
  completeStaticRequests,
  splitViewportIntoStaticAndLiveIntervals,
} from './requestIntervalUtils';
import { GetAssetPropertyValueHistoryDataRequest } from './types';
import {
  DEFAULT_LATE_DATA_INTERVALS,
  LiveDataInterval,
  intervalAsRequestQuery,
} from './liveDataIntervals';
import { isInViewport } from './viewportUtils';
import { queryClient } from '../queryClient';

const handleRequest =
  ({
    request,
    cache,
    liveDataIntervals = DEFAULT_LATE_DATA_INTERVALS,
  }: {
    request: GetAssetPropertyValueHistoryDataRequest;
    cache: AssetPropertyValueHistoryDataCache;
    liveDataIntervals?: LiveDataInterval[];
  }) =>
  async () => {
    cache.cancelTimeSeriesRequests(request, { status: 'pending' });

    const { staticDataInterval, liveDataInterval } =
      splitViewportIntoStaticAndLiveIntervals(
        request.viewport,
        liveDataIntervals
      );

    const requests: GetAssetPropertyValueHistoryDataRequest[] = [];

    if (staticDataInterval) {
      const staticIntervalRequest = {
        ...request,
        viewport: staticDataInterval,
      };
      const existingStaticRequests = cache.getTimeSeriesRequests(
        staticIntervalRequest,
        { status: 'success', inViewport: true }
      );

      const collapsedRequests = collapseRequests(existingStaticRequests);

      const completedRequests = completeStaticRequests(
        staticIntervalRequest,
        collapsedRequests
      );

      requests.push(...completedRequests);
    }

    if (liveDataInterval) {
      const liveIntervalRequest = {
        ...request,
        viewport: liveDataInterval,
      };
      const existingLiveRequests = liveDataIntervals.map((interval) =>
        intervalAsRequestQuery(liveIntervalRequest, interval)
      );

      const relevantRequests = existingLiveRequests.filter((request) =>
        isInViewport(request.viewport)(liveDataInterval)
      );

      requests.push(...relevantRequests);
    }

    return requests;
  };

export const useTimeSeriesDataRequestManager = ({
  requests,
  cache,
}: {
  requests: GetAssetPropertyValueHistoryDataRequest[];
  cache: AssetPropertyValueHistoryDataCache;
}) => {
  return useQueries(
    {
      queries: requests.map((request) => ({
        queryKey: cache.getKeyManager().toRequestQueryKey(request),
        queryFn: handleRequest({ request, cache }),
        gcTime: 10,
      })),
    },
    queryClient
  );
};

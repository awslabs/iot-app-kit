import { useState } from 'react';
import { queryClient } from '../queryClient';
import { AssetPropertyValueHistoryDataCache } from './assetPropertyValueHistoryCache';
import { useTimeSeriesDataRequestManager } from './requestManager';
import { TimeSeriesDataCacheKeyManager } from './timeSeriesDataCacheKeyManager';
import { useTimeSeriesDataManager } from './timeSeriesDataManager';
import { useTimeSeriesDataRequestExectionManager } from './timeSeriesDataRequestExecutionManager';
import {
  GetAssetPropertyValueHistoryDataRequest,
  GetAssetPropertyValueHistoryRequestFunction,
} from './types';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';

const keyManager = new TimeSeriesDataCacheKeyManager({
  resource: 'AssetPropertyValueHistory',
});
const cache = new AssetPropertyValueHistoryDataCache({
  keyManager,
  client: queryClient,
});

const combineResults = ({
  requests,
  cache,
}: {
  requests: GetAssetPropertyValueHistoryDataRequest[];
  cache: AssetPropertyValueHistoryDataCache;
}) => {
  return requests.map((request) => {
    const states = cache.getTimeSeriesRequestsState(request);

    return {
      data: cache.getTimeSeriesData(request),
      isError: states.some((state) => state.status === 'error'),
      isFetching: states.some((state) => state.fetchStatus === 'fetching'),
      isLoading: states.some((state) => state.status === 'pending'),
      isSuccess: states.every((state) => state.status === 'success'),
    };
  });
};

type UseAssetPropertyValueHistoryOptions = {
  requests?: GetAssetPropertyValueHistoryDataRequest[];
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
};

export const useAssetPropertyValueHistory = ({
  requests = [],
  getAssetPropertyValueHistory,
}: UseAssetPropertyValueHistoryOptions) => {
  const dataQueries = useTimeSeriesDataManager({
    requests,
    cache,
  });

  const resolvedQueries = useTimeSeriesDataRequestManager({
    requests,
    cache,
  });

  const requestExecutionQueries = useTimeSeriesDataRequestExectionManager({
    getAssetPropertyValueHistory,
    requests: resolvedQueries.flatMap(({ data = [] }) => data),
    cache,
  });

  const [results, setResults] = useState(combineResults({ requests, cache }));
  useCustomCompareEffect(
    () => {
      setResults(combineResults({ requests, cache }));
    },
    [dataQueries, requestExecutionQueries],
    isEqual
  );

  return results;
};

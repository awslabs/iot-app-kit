import { useEffect, useState } from 'react';
import { GetAssetPropertyValueHistoryDataRequest } from './types';
import { AssetPropertyValueHistoryDataCache } from './assetPropertyValueHistoryCache';
import { useQueries } from '@tanstack/react-query';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'lodash.isequal';
import { zip } from 'lodash';
import { queryClient } from '../queryClient';

export const useTimeSeriesDataManager = ({
  requests,
  cache,
}: {
  requests: GetAssetPropertyValueHistoryDataRequest[];
  cache: AssetPropertyValueHistoryDataCache;
}) => {
  const [memoedRequests, setMemoedRequests] = useState(requests);

  useCustomCompareEffect(
    () => {
      setMemoedRequests(requests);
    },
    [requests],
    ([a], [b]) =>
      zip(a, b).every(([a, b]) => {
        if (a == null || b == null) return false;
        const { viewport: viewportA, ...optionsA } = a;
        const { viewport: viewportB, ...optionsB } = b;
        return isEqual(optionsA, optionsB);
      })
  );

  useEffect(() => {
    memoedRequests.forEach((request) => {
      // ensure that an entry exists in the cache for each request
      cache.setTimeSeriesRequestData(request, cache.EMPTY_DATA);
    });
  }, [memoedRequests]);

  return useQueries(
    {
      queries: memoedRequests.map((request) => ({
        queryKey: cache.getKeyManager().toDataCacheQueryKey(request),
        queryFn: async () => {
          // should actually never execute
          // the query needs to be used so that
          // tanstack does not garbage collect the query
          // as long as a react hook accesses a getter on
          // the query object, tanstack will keep the query active
          return cache.getTimeSeriesData(request);
        },
        gcTime: 5000,
      })),
    },
    queryClient
  );
};

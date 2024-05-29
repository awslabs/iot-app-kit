import { useMemo } from 'react';
import {
  RequestSettings,
  Viewport,
  useLiveDataIntervals,
  useTimeSeriesBisectedData,
  useTimeSeriesDataCachedQueries,
  useTimeSeriesDataRequestExecuter,
  useTimeSeriesDataRequestManager,
  useTimeSeriesDataRequestStatus,
} from '../useTimeSeriesData';
import {
  AssetPropertyValueHistoryRequest,
  AssetPropertyValuesRequestFunctions,
} from './types';
import { ASSET_PROPERTY_VALUES_CACHE_CLIENT } from './cacheClient';

import { GetAssetPropertyValuesRequestExecution } from './requestExecution';
import { useTimeSeriesDataResponse } from '../useTimeSeriesData/useResponse';
import {
  useAutoRequestResolution,
  useRequestResolverStrategy,
} from './requestManager';

type AssetPropertyValuesOptions = {
  requests: AssetPropertyValueHistoryRequest[];
  viewport: Viewport;
  requestFns: AssetPropertyValuesRequestFunctions;
  settings: RequestSettings;
};

export const useAssetPropertyValues = ({
  requests: passedInRequests,
  viewport,
  requestFns,
  settings,
}: AssetPropertyValuesOptions) => {
  const requests = useAutoRequestResolution({
    requests: passedInRequests,
    viewport,
  });

  const cacheClient = useMemo(() => ASSET_PROPERTY_VALUES_CACHE_CLIENT, []);

  const liveDataIntervals = useLiveDataIntervals({
    viewport,
  });

  const requestExecuter = useMemo(
    () =>
      new GetAssetPropertyValuesRequestExecution({
        cacheClient,
        ...requestFns,
      }),
    [requestFns, cacheClient]
  );

  const requestResolver = useRequestResolverStrategy({
    viewport,
    cacheClient,
    liveDataIntervals,
  });

  const cachedQueries = useTimeSeriesDataCachedQueries({
    requests,
    cacheClient,
  });

  const dataQueries = useTimeSeriesBisectedData({
    requests,
    viewport,
    cacheClient,
  });

  const requestQueries = useTimeSeriesDataRequestManager({
    requests,
    viewport,
    cacheClient,
    settings,
    requestResolver,
  });

  const requestExecutionQueries = useTimeSeriesDataRequestExecuter({
    requestQueries,
    cacheClient,
    requestExecuter,
  });

  const statuses = useTimeSeriesDataRequestStatus({
    requestQueries,
    requestExecutionQueries,
    cachedQueries,
    dataQueries,
  });

  return useTimeSeriesDataResponse({ cacheClient, statuses, dataQueries });
};

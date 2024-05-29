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
import { RequestFunctions } from './requestExecution/types';
import { AssetPropertyValueHistoryRequest } from './types';
import { ASSET_PROPERTY_VALUE_HISTORY_CACHE_CLIENT } from './cacheClient';

import { GetAssetPropertyValueHistoryRequestExecution } from './requestExecution';
import { useTimeSeriesDataResponse } from '../useTimeSeriesData/useResponse';
import { useRequestResolverStrategy } from './requestManager';

type AssetPropertyValueHistoryOptions = {
  requests: AssetPropertyValueHistoryRequest[];
  viewport: Viewport;
  requestFns: RequestFunctions;
  settings: RequestSettings;
};

export const useAssetPropertyValueHistory = ({
  requests,
  viewport,
  requestFns,
  settings,
}: AssetPropertyValueHistoryOptions) => {
  const cacheClient = useMemo(
    () => ASSET_PROPERTY_VALUE_HISTORY_CACHE_CLIENT,
    []
  );

  const liveDataIntervals = useLiveDataIntervals({
    viewport,
  });

  const requestExecuter = useMemo(
    () =>
      new GetAssetPropertyValueHistoryRequestExecution({
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

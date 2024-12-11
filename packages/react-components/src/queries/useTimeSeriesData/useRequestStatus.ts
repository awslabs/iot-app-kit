import isEqual from 'lodash-es/isEqual';
import { useMemo } from 'react';
import { compact } from '@iot-app-kit/helpers';
import { aggregateStatuses } from './queryUtils';
import { type useTimeSeriesDataRequestExecuter } from './requestExecution';
import { type useTimeSeriesDataRequestManager } from './requestManager';
import { type useTimeSeriesBisectedData } from './useBisectedData';
import { type useTimeSeriesDataCachedQueries } from './useCachedQueries';

type UseRequestStatusOptions<Request, Data> = {
  requestQueries: ReturnType<
    typeof useTimeSeriesDataRequestManager<Request, Data>
  >;
  requestExecutionQueries: ReturnType<
    typeof useTimeSeriesDataRequestExecuter<Request, Data>
  >;
  cachedQueries: ReturnType<
    typeof useTimeSeriesDataCachedQueries<Request, Data>
  >;
  dataQueries: ReturnType<typeof useTimeSeriesBisectedData<Request, Data>>;
};

export const useTimeSeriesDataRequestStatus = <Request, Data>({
  requestQueries,
  requestExecutionQueries,
  cachedQueries,
  dataQueries,
}: UseRequestStatusOptions<Request, Data>) => {
  return useMemo(() => {
    return requestQueries.map(({ queryRequest, queryResult }) => {
      const likeRequestExecutionQueries = requestExecutionQueries.find(
        ({ queryRequest: queryExecutionRequest }) => {
          return isEqual(queryRequest, queryExecutionRequest);
        }
      );

      const requestExecutionQueryResults =
        likeRequestExecutionQueries?.queryResults ?? [];

      const likeCachedQuery = cachedQueries.find(({ data }) => {
        return isEqual(queryRequest, data?.request);
      });

      const likeDataQuery = dataQueries.find(({ data }) => {
        return isEqual(queryRequest, data?.request);
      });

      const statuses = compact([
        queryResult,
        ...requestExecutionQueryResults,
        likeCachedQuery,
        likeDataQuery,
      ]);

      return {
        queryRequest,
        status: aggregateStatuses(statuses),
      };
    });
  }, [requestQueries, requestExecutionQueries, cachedQueries, dataQueries]);
};

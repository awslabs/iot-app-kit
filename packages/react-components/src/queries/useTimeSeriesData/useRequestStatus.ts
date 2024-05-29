import isEqual from 'lodash.isequal';
import { useTimeSeriesDataRequestManager } from './requestManager';
import { createNonNullableList } from '../../utils/createNonNullableList';
import { aggregateStatuses } from './queryUtils';
import { useMemo } from 'react';
import { useTimeSeriesDataCachedQueries } from './useCachedQueries';
import { useTimeSeriesDataRequestExecuter } from './requestExecution';
import { useTimeSeriesBisectedData } from './useBisectedData';

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

      const statuses = createNonNullableList([
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

import { useCallback, useMemo } from 'react';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import zip from 'lodash/zip';
import groupBy from 'lodash.groupby';
import {
  createNonNullableList,
  createNonNullableTupleList,
} from '../../../utils/createNonNullableList';
import { useTimeSeriesDataRequestManager } from '../requestManager';
import {
  TimeSeriesDataCacheClient,
  TimeSeriesDataCacheKeyManager,
} from '../cacheClient';
import { TimeSeriesDataRequestExecution } from '../requestExecution/requestExecution';
import { IntervalTransformer, getViewportType } from '../intervals';

type UseRequestExecuterOptions<Request, Data> = {
  cacheClient: TimeSeriesDataCacheClient<Request, Data>;
  requestQueries: ReturnType<
    typeof useTimeSeriesDataRequestManager<Request, Data>
  >;
  requestExecuter: TimeSeriesDataRequestExecution<Request, Data>;
};

export const useTimeSeriesDataRequestExecuter = <Request, Data>({
  requestQueries,
  cacheClient,
  requestExecuter,
}: UseRequestExecuterOptions<Request, Data>) => {
  const queryFn = useCallback(
    async ({
      signal,
      queryKey: [{ request: serializedRequest, viewport }],
    }: QueryFunctionContext<
      ReturnType<
        TimeSeriesDataCacheKeyManager<Request>['toRequestExectutionQueryKey']
      >
    >) => {
      const now = Date.now();
      const intervalTransformer = new IntervalTransformer({
        now,
        viewportType: getViewportType(viewport),
      });

      const interval = intervalTransformer.toInterval(viewport);

      const request = cacheClient
        .getKeyManager()
        .deserializeRequest(serializedRequest);

      const result = await requestExecuter.send({ signal, request, interval });

      return {
        serializedRequest,
        viewport,
        result,
      };
    },
    [requestExecuter, cacheClient]
  );

  const requests = useMemo(() => {
    return createNonNullableList(
      requestQueries.flatMap(({ queryResult }) =>
        queryResult.data?.map((request) => request)
      )
    );
  }, [requestQueries]);

  const queries = useMemo(() => {
    return requests.map(({ request, viewport }) => ({
      queryKey: cacheClient
        .getKeyManager()
        .toRequestExectutionQueryKey(request, viewport),
      refetchInterval: viewport.refreshRate,
      initialData: () => {
        if (cacheClient.isTimeSeriesDataRequestCached({ request, viewport })) {
          return cacheClient.getTimeSeriesData({ request, viewport });
        }

        return undefined;
      },
      queryFn,
    }));
  }, [requests, cacheClient, queryFn]);

  const queryResults = useQueries(
    {
      queries,
    },
    cacheClient.getQueryClient()
  );

  return useMemo(() => {
    const requestsWithResults = createNonNullableTupleList(
      zip(requests, queryResults)
    );
    const aggregatedStatues = groupBy(requestsWithResults, ([{ request }]) =>
      JSON.stringify(cacheClient.getKeyManager().serializeRequest(request))
    );
    return Object.values(aggregatedStatues).map((requestsWithStatuses) => {
      // all requests will be the same from the groupby above
      const [{ request }] = requestsWithStatuses[0];
      const queryResults = requestsWithStatuses.map(
        ([_request, queryResult]) => queryResult
      );
      return {
        queryRequest: request,
        queryResults,
      };
    });
  }, [requests, queryResults, cacheClient]);
};

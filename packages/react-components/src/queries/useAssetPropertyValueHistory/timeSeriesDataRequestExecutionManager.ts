import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
import { AssetPropertyValueHistoryDataCache } from './assetPropertyValueHistoryCache';
import {
  GetAssetPropertyValueHistoryDataRequest,
  GetAssetPropertyValueHistoryRequestFunction,
} from './types';
import { queryClient } from '../queryClient';
import {
  TimeSeriesDataCacheKeyManager,
  TimeSeriesDataCacheRequestKeyShape,
} from './timeSeriesDataCacheKeyManager';
import invariant from 'tiny-invariant';
import { hasRequestFunction, isAssetId, isPropertyId } from '../predicates';
import { asHistoricalViewport } from './viewportUtils';
import {
  GetGetAssetPropertyValueHistoryRequest,
  RequestSuccessCallback,
} from './getGetAssetPropertyValueHistoryRequest';

const isViewport = (
  viewport: TimeSeriesDataCacheRequestKeyShape['viewport']
) => {
  try {
    TimeSeriesDataCacheKeyManager.deserializeViewport(viewport);
    return true;
  } catch (e) {
    return false;
  }
};

export const createTimeSeriesDataRequestQueryFn = ({
  getAssetPropertyValueHistory,
  onRequestSuccess,
}: {
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
  onRequestSuccess?: RequestSuccessCallback;
}) => {
  return async ({
    queryKey: [{ assetId, propertyId, viewport }],
    signal,
  }: QueryFunctionContext<
    ReturnType<TimeSeriesDataCacheKeyManager['toRequestExectutionQueryKey']>
  >) => {
    invariant(
      hasRequestFunction<GetAssetPropertyValueHistoryRequestFunction>(
        getAssetPropertyValueHistory
      ),
      'Expected request function to be defined as required by the enabled flag.'
    );

    invariant(
      isAssetId(assetId),
      'Expected assetId to be defined as required by the enabled flag.'
    );

    invariant(
      isPropertyId(propertyId),
      'Expected propertyId to be defined as required by the enabled flag.'
    );

    invariant(
      isViewport(viewport),
      'Expected viewport to be defined as required by the enabled flag.'
    );

    const { startDate, endDate } = asHistoricalViewport(
      TimeSeriesDataCacheKeyManager.deserializeViewport(viewport)
    );

    return await new GetGetAssetPropertyValueHistoryRequest({
      assetId,
      propertyId,
      startDate,
      endDate,
      signal,
      onRequestSuccess,
      requestFunction: getAssetPropertyValueHistory,
    }).send();
  };
};

const createTimeSeriesDataRequestInitialData =
  ({
    request,
    cache,
  }: {
    request: GetAssetPropertyValueHistoryDataRequest;
    cache: AssetPropertyValueHistoryDataCache;
  }) =>
  () => {
    if (cache.requestIsCached(request)) {
      return cache.getTimeSeriesData(request);
    }
    return undefined;
  };

const createTimeSeriesDataRequestRefetchInterval =
  ({
    request,
  }: {
    request: GetAssetPropertyValueHistoryDataRequest;
    cache: AssetPropertyValueHistoryDataCache;
  }) =>
  () => {
    // need to make this more sophisticated
    return request.viewport.refreshRate;
  };

export const useTimeSeriesDataRequestExectionManager = ({
  requests,
  cache,
  getAssetPropertyValueHistory,
}: {
  requests: GetAssetPropertyValueHistoryDataRequest[];
  cache: AssetPropertyValueHistoryDataCache;
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
}) => {
  return useQueries(
    {
      queries: requests.map((request) => ({
        queryKey: cache.getKeyManager().toRequestExectutionQueryKey(request),
        queryFn: createTimeSeriesDataRequestQueryFn({
          getAssetPropertyValueHistory,
          onRequestSuccess: (_request, response) => {
            cache.setTimeSeriesRequestData(request, response);
          },
        }),
        refetchInterval: createTimeSeriesDataRequestRefetchInterval({
          request,
          cache,
        }),
        initialData: createTimeSeriesDataRequestInitialData({ request, cache }),
      })),
    },
    queryClient
  );
};

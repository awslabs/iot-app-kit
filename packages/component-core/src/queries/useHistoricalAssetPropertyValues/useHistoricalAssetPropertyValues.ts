import { useMemo } from 'react';
import { type QueryFunctionContext, useQueries } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { useIoTSiteWiseClient } from '../../hooks/requestFunctions/useIoTSiteWiseClient';
import { queryClient } from '../queryClient';
import {
  hasRequestFunction,
  isAssetId,
  isPropertyAlias,
  isPropertyId,
} from '../predicates';

import {
  type HistoricalAssetPropertyValueRequest,
  type HistoricalValueQueryFnClient,
  type UseHistoricalAssetPropertyValuesOptions,
} from './types';
import { HistoricalAssetPropertyValueKeyFactory } from './historicalAssetPropertyValueKeyFactory';
import {
  GetHistoricalAssetPropertyValueRequest,
  HistoricalAssetPropertyValueBatcher,
} from './requestExecution';
import {
  type BatchGetAssetPropertyValueHistory,
  type GetAssetPropertyValueHistory,
  isDurationViewport,
  isHistoricalViewport,
} from '@iot-app-kit/core';
import { useRefreshRate } from './useRefreshRate';
import { useSyncTimeSeriesDataQueries } from '../utils/useTimeSeriesDataQuerySync';

const requestIsValid = ({
  assetId,
  propertyId,
  propertyAlias,
  viewport,
}: HistoricalAssetPropertyValueRequest) =>
  viewport != null &&
  (isDurationViewport(viewport) || isHistoricalViewport(viewport)) &&
  ((isAssetId(assetId) && isPropertyId(propertyId)) ||
    isPropertyAlias(propertyAlias));

const clientIsValid = ({
  getAssetPropertyValueHistory,
  batchGetAssetPropertyValueHistory,
}: HistoricalValueQueryFnClient = {}) =>
  hasRequestFunction<GetAssetPropertyValueHistory>(
    getAssetPropertyValueHistory
  ) ||
  hasRequestFunction<BatchGetAssetPropertyValueHistory>(
    batchGetAssetPropertyValueHistory
  );

/**
 * useHistoricalAssetPropertyValues is a hook used to call
 * getAssetPropertyValueHistory or batchGetAssetPropertyValueHistory
 * on a list of GetAssetPropertyValueHistoryRequest requests
 *
 * batch apis are preferred when available but may
 * not be available on all clients. For example,
 * clients at the edge currently don't support
 * batch apis.
 *
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param enabled will manually disable the hook
 * @param requests list of GetAssetPropertyValueHistoryRequest
 * @param refreshRate refresh rate for GetAssetPropertyValueHistoryRequest in ms
 * @param maxNumberOfValues maximum number of asset property values to request
 * within a given viewport
 * - default: Infinity (which will request all values within the given viewport)
 * @param viewportMode How to interpret the viewport when requestng data.
 * @returns a list of QueryResults with GetAssetPropertyValueHistoryResponse data.
 */
export const useHistoricalAssetPropertyValues = ({
  iotSiteWiseClient,
  enabled = true,
  requests = [],
  refreshRate: passedInRefreshRate,
  viewport,
  retry,
  fetchMode = 'START_TO_END',
  maxNumberOfValues = fetchMode === 'START_TO_END' ? Infinity : 1,
}: UseHistoricalAssetPropertyValuesOptions) => {
  /**
   * Normalize refresh rate for instances of useHistoricalAssetPropertyValues
   * If refresh rate is not provided, one will be chosen based on the viewport
   * in the useRefreshRate hook.
   */
  const refreshRate = useRefreshRate({
    refreshRate: passedInRefreshRate,
    viewport,
  });

  /**
   * A single enabled flag for all useHistoricalAssetPropertyValues
   * with the same refreshRate. This will toggle the queries
   * off / on in a setTimeout so that the executions all
   * happen in the same task and the resulting refetchInterval
   * executes within the batch timeout window.
   */
  const syncFlag = useSyncTimeSeriesDataQueries({
    enabled,
    refreshRate,
  });

  const { getAssetPropertyValueHistory, batchGetAssetPropertyValueHistory } =
    useIoTSiteWiseClient({ iotSiteWiseClient });

  const queries = useMemo(() => {
    return requests.map((request) => {
      return {
        enabled:
          syncFlag &&
          enabled &&
          clientIsValid({
            getAssetPropertyValueHistory,
            batchGetAssetPropertyValueHistory,
          }) &&
          requestIsValid({ ...request, viewport }),
        queryKey: new HistoricalAssetPropertyValueKeyFactory({
          ...request,
          viewport,
          maxNumberOfValues,
          fetchMode,
        }).create(),
        queryFn: createHistoricalAssetPropertyValueQueryFn({
          getAssetPropertyValueHistory,
          batchGetAssetPropertyValueHistory,
        }),
        refetchInterval: refreshRate,
        retry,
      };
    });
  }, [
    getAssetPropertyValueHistory,
    batchGetAssetPropertyValueHistory,
    enabled,
    syncFlag,
    requests,
    viewport,
    refreshRate,
    retry,
    maxNumberOfValues,
    fetchMode,
  ]);

  return useQueries(
    {
      queries,
    },
    queryClient
  );
};

export const createHistoricalAssetPropertyValueQueryFn = (
  client?: HistoricalValueQueryFnClient
) => {
  return async ({
    queryKey: [
      {
        assetId,
        propertyId,
        propertyAlias,
        viewport,
        qualities,
        timeOrdering,
        maxNumberOfValues,
        fetchMode,
      },
    ],
    signal,
  }: QueryFunctionContext<
    ReturnType<HistoricalAssetPropertyValueKeyFactory['create']>
  >) => {
    const { getAssetPropertyValueHistory, batchGetAssetPropertyValueHistory } =
      client ?? {};

    invariant(
      clientIsValid(client),
      'Expected getAssetPropertyValueHistory or batchGetAssetPropertyValueHistory to be defined as required by the enabled flag.'
    );

    invariant(
      requestIsValid({ assetId, propertyId, propertyAlias, viewport }),
      'Expected assetId and propertyId or propertyAlias and viewport to be defined as required by the enabled flag.'
    );

    if (batchGetAssetPropertyValueHistory) {
      return await HistoricalAssetPropertyValueBatcher.getInstance({
        batchGetAssetPropertyValueHistory,
        maxNumberOfValues,
      }).send(
        {
          assetId,
          propertyId,
          propertyAlias,
          qualities,
          timeOrdering,
          viewport,
          fetchMode,
        },
        {
          abortSignal: signal,
        }
      );
    }

    if (getAssetPropertyValueHistory) {
      return await new GetHistoricalAssetPropertyValueRequest({
        getAssetPropertyValueHistory,
        maxNumberOfValues,
      }).send(
        {
          assetId,
          propertyId,
          propertyAlias,
          qualities,
          timeOrdering,
          viewport,
          fetchMode,
        },
        {
          abortSignal: signal,
        }
      );
    }

    throw 'Expected request to be handled by one of the two client functions as required by the enabled flag.';
  };
};

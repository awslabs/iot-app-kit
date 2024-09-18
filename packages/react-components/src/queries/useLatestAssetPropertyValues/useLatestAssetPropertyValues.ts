import { useMemo } from 'react';
import { QueryFunctionContext, useQueries } from '@tanstack/react-query';
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
  LatestAssetPropertyValueRequest,
  LatestValueQueryFnClient,
  UseLatestAssetPropertyValuesOptions,
} from './types';
import { LatestAssetPropertyValueKeyFactory } from './latestAssetPropertyValueKeyFactory';
import {
  GetLatestAssetPropertyValueRequest,
  LatestAssetPropertyValueBatcher,
} from './requestExecution';
import {
  BatchGetAssetPropertyValue,
  GetAssetPropertyValue,
} from '@iot-app-kit/core';
import { useSyncTimeSeriesDataQueries } from '../utils/useTimeSeriesDataQuerySync';

const DEFAULT_REFRESH_RATE = 5000;

const requestIsValid = ({
  assetId,
  propertyId,
  propertyAlias,
}: LatestAssetPropertyValueRequest) =>
  (isAssetId(assetId) && isPropertyId(propertyId)) ||
  isPropertyAlias(propertyAlias);

const clientIsValid = ({
  getAssetPropertyValue,
  batchGetAssetPropertyValue,
}: LatestValueQueryFnClient = {}) =>
  hasRequestFunction<GetAssetPropertyValue>(getAssetPropertyValue) ||
  hasRequestFunction<BatchGetAssetPropertyValue>(batchGetAssetPropertyValue);

/**
 * useLatestAssetPropertyValues is a hook used to call
 * getAssetPropertyValue or batchGetAssetPropertyValue
 * on a list of GetAssetPropertyValueRequest requests
 *
 * batch apis are preferred when available but may
 * not be available on all clients. For example,
 * clients at the edge currently don't support
 * batch apis.
 *
 * @param iotSiteWiseClient is an AWS SDK IoT SiteWise client
 * @param enabled will manually disable the hook
 * @param requests list of GetAssetPropertyValueRequest
 * @param refreshRate refresh rate for GetAssetPropertyValueRequest in ms
 * @returns a list of QueryResults with GetAssetPropertyValueResponse data.
 */
export const useLatestAssetPropertyValues = ({
  iotSiteWiseClient,
  requests = [],
  refreshRate = DEFAULT_REFRESH_RATE,
  enabled = true,
  retry,
}: UseLatestAssetPropertyValuesOptions) => {
  /**
   * A single enabled flag for all useLatestAssetPropertyValues
   * with the same refreshRate. This will toggle the queries
   * off / on in a setTimeout so that the executions all
   * happen in the same task and the resulting refetchInterval
   * executes within the batch timeout window.
   */
  const syncFlag = useSyncTimeSeriesDataQueries({
    enabled,
    refreshRate,
  });

  const { getAssetPropertyValue, batchGetAssetPropertyValue } =
    useIoTSiteWiseClient({ iotSiteWiseClient });

  const queries = useMemo(() => {
    return requests.map((request) => {
      return {
        enabled:
          syncFlag &&
          enabled &&
          clientIsValid({
            getAssetPropertyValue,
            batchGetAssetPropertyValue,
          }) &&
          requestIsValid(request),
        queryKey: new LatestAssetPropertyValueKeyFactory(request).create(),
        queryFn: createLatestAssetPropertyValueQueryFn({
          getAssetPropertyValue,
          batchGetAssetPropertyValue,
        }),
        refetchInterval: refreshRate,
        retry,
      };
    });
  }, [
    getAssetPropertyValue,
    batchGetAssetPropertyValue,
    enabled,
    syncFlag,
    requests,
    refreshRate,
    retry,
  ]);

  return useQueries(
    {
      queries,
    },
    queryClient
  );
};

export const createLatestAssetPropertyValueQueryFn = (
  client?: LatestValueQueryFnClient
) => {
  return async ({
    queryKey: [{ assetId, propertyId, propertyAlias }],
    signal,
  }: QueryFunctionContext<
    ReturnType<LatestAssetPropertyValueKeyFactory['create']>
  >) => {
    const { getAssetPropertyValue, batchGetAssetPropertyValue } = client ?? {};

    invariant(
      clientIsValid(client),
      'Expected getAssetPropertyValue or batchGetAssetPropertyValue to be defined as required by the enabled flag.'
    );

    invariant(
      requestIsValid({ assetId, propertyId, propertyAlias }),
      'Expected assetId and propertyId to be defined or propertyAlias to be defined as required by the enabled flag.'
    );

    if (batchGetAssetPropertyValue) {
      return await LatestAssetPropertyValueBatcher.getInstance({
        batchGetAssetPropertyValue,
      }).send(
        {
          assetId,
          propertyId,
          propertyAlias,
        },
        {
          abortSignal: signal,
        }
      );
    }

    if (getAssetPropertyValue) {
      return await new GetLatestAssetPropertyValueRequest({
        getAssetPropertyValue,
      }).send(
        {
          assetId,
          propertyId,
          propertyAlias,
        },
        {
          abortSignal: signal,
        }
      );
    }

    throw 'Expected request to be handled by one of the two client functions as required by the enabled flag.';
  };
};

import type { TimeSeriesRequestParameters } from './types';
import {
  type BatchGetAssetPropertyValue,
  type ListTimeSeries,
} from '@iot-app-kit/core';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import {
  type TimeSeriesResource,
  type TimeSeriesResourceWithLatestValue,
} from '../../types/resources';
import { useMultipleListRequests } from '../../requests/use-multiple-list-requests';
import { useLatestValues } from '../../requests/use-latest-values';
import { transformListTimeSeriesResponse } from '../../helpers/response-transformers';

export interface UseTimeSeriesOptions extends UseListAPIBaseOptions {
  parameters: readonly TimeSeriesRequestParameters[];
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
  listTimeSeries?: ListTimeSeries;
}

export interface UseTimeSeriesResult extends UseListAPIBaseResult {
  timeSeries: TimeSeriesResource[] | TimeSeriesResourceWithLatestValue[];
}

export function useTimeSeries({
  pageSize,
  parameters,
  batchGetAssetPropertyValue,
  listTimeSeries,
}: UseTimeSeriesOptions): UseTimeSeriesResult {
  const {
    resources: timeSeriesWithoutLatestValues,
    isLoading: isLoadingTimeSeriesWithLatestValues,
    error,
    hasNextPage,
    nextPage,
  } = useMultipleListRequests({
    resourceId: 'TimeSeriesSummary',
    pageSize,
    parameters,
    requestFn: listTimeSeries,
    responseTransformer: transformListTimeSeriesResponse,
  });

  const {
    dataStreamsWithLatestValue: timeSeriesWithLatestValues,
    isLoading: isLoadingTimeSeriesWithoutLatestValues,
  } = useLatestValues({
    dataStreams: timeSeriesWithoutLatestValues,
    batchGetAssetPropertyValue: batchGetAssetPropertyValue,
    createEntryId: ({ timeSeriesId }) => timeSeriesId,
  });

  const timeSeries =
    batchGetAssetPropertyValue !== undefined
      ? timeSeriesWithLatestValues
      : timeSeriesWithoutLatestValues;

  const isLoading =
    isLoadingTimeSeriesWithLatestValues ||
    isLoadingTimeSeriesWithoutLatestValues;

  return {
    timeSeries,
    isLoading,
    error,
    hasNextPage,
    nextPage,
  };
}

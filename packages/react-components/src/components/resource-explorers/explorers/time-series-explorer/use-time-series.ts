import {
  type BatchGetAssetPropertyValue,
  type ListTimeSeries,
} from '@iot-app-kit/core';
import { transformListTimeSeriesResponse } from '../../helpers/response-transformers';
import { useLatestValues } from '../../requests/use-latest-values';
import { useMultipleListRequests } from '../../requests/use-multiple-list-requests';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import {
  type TimeSeriesResource,
  type TimeSeriesResourceWithLatestValue,
} from '../../types/resources';
import type { TimeSeriesRequestParameters } from './types';

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
    isLoadingFirstPage: isLoadingTimeSeriesWithLatestValues,
    error,
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

  const isLoadingFirstPage =
    isLoadingTimeSeriesWithLatestValues ||
    isLoadingTimeSeriesWithoutLatestValues;

  return {
    timeSeries,
    isLoadingFirstPage,
    isLoadingResources: isLoadingFirstPage,
    error,
  };
}

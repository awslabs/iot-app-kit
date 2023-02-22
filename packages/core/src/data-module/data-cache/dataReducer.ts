import { Reducer } from 'redux';

import { AsyncActions, ERROR, REQUEST, SUCCESS } from './dataActions';
import { getDataStreamStore } from './getDataStreamStore';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';

import { DataStreamsStore } from './types';
import { mergeHistoricalRequests } from './mergeHistoricalRequests';
import { getDataPoints } from '../../common/getDataPoints';
import { parseDuration } from '../../common/time';
import { AggregateType } from '@aws-sdk/client-iotsitewise';

/**
 * Data Reducer
 *
 * Manages error status, loading status, and indexed data points
 */

export const dataReducer: Reducer<DataStreamsStore, AsyncActions> = (
  state: DataStreamsStore = {},
  action: AsyncActions
): DataStreamsStore => {
  switch (action.type) {
    case REQUEST: {
      const { id, resolution, aggregationType, start, end, fetchFromStartToEnd } = action.payload;
      const streamStore = getDataStreamStore(id, resolution, state, aggregationType);
      const dataCache = streamStore != null ? streamStore.dataCache : EMPTY_CACHE;
      const requestCache = streamStore != null ? streamStore.requestCache : EMPTY_CACHE;
      const existingRequestHistory = streamStore ? streamStore.requestHistory : [];

      // We only consider it loading if data has not been requested before, or if it's already loading.
      const isLoading = streamStore == null || streamStore.isLoading;

      const numericResolution = parseDuration(resolution);

      const newStreamStore = {
        ...streamStore,
        resolution: numericResolution,
        aggregationType: aggregationType,
        requestHistory: fetchFromStartToEnd
          ? mergeHistoricalRequests(existingRequestHistory, {
              start,
              end,
              requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
            })
          : existingRequestHistory,
        dataCache,
        requestCache: fetchFromStartToEnd
          ? addToDataPointCache({
              cache: requestCache,
              start,
              end,
            })
          : requestCache,
        id,
        isLoading,
        isRefreshing: false,
      };

      const newResolutions =
        numericResolution != 0
          ? {
              ...state[id]?.resolutions,
              [numericResolution]: {
                ...state[id]?.resolutions?.[numericResolution],
                [AggregateType.AVERAGE]: newStreamStore,
              },
            }
          : state[id]?.resolutions || undefined;
      const newRawData =
        numericResolution === 0 ? { ...state[id]?.rawData, ...newStreamStore } : state[id]?.rawData || undefined;

      return {
        ...state,
        [id]: {
          ...state[id],
          resolutions: newResolutions,
          rawData: newRawData,
        },
      };
    }

    case SUCCESS: {
      const { id, data: dataStream, first, last, requestInformation } = action.payload;
      const streamStore = getDataStreamStore(id, dataStream.resolution, state, requestInformation.aggregationType);
      // Updating request cache is a hack to deal with latest value update
      // TODO: clean this to one single source of truth cache
      const requestCache = streamStore != null ? streamStore.requestCache : EMPTY_CACHE;

      // We always want data in ascending order in the cache
      const sortedData = getDataPoints(dataStream, dataStream.resolution).sort((a, b) => a.x - b.x);

      /**
       * Based on the type of request, determine the actual range requested.
       *
       * For instance, when we fetch latest value, we stop looking for data when we find the first point, and potentially seek beyond the start of the viewport.
       * This must be taken into account.
       */
      let intervalStart = first;

      // start the interval from the returned data point to avoid over-caching
      // if there is no data point it's fine to cache the entire interval
      if (
        (requestInformation.fetchMostRecentBeforeStart || requestInformation.fetchMostRecentBeforeEnd) &&
        sortedData.length > 0
      ) {
        intervalStart = new Date(sortedData[0].x);
      }

      const updatedDataCache = addToDataPointCache({
        start: intervalStart,
        end: last,
        data: sortedData,
        cache: (streamStore && streamStore.dataCache) || EMPTY_CACHE,
      });

      const existingRequestHistory = streamStore ? streamStore.requestHistory : [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, aggregates, ...restOfDataStream } = dataStream;

      const newStreamStore = {
        ...streamStore,
        ...restOfDataStream,
        requestHistory: mergeHistoricalRequests(existingRequestHistory, {
          start: intervalStart,
          end: last,
          requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
        }),
        requestCache: !requestInformation.fetchFromStartToEnd
          ? addToDataPointCache({
              cache: requestCache,
              start: intervalStart,
              end: last,
            })
          : requestCache,
        dataCache: updatedDataCache,
        isLoading: false,
        isRefreshing: false,
        error: undefined,
      };

      const newResolutions =
        dataStream.resolution != 0
          ? {
              ...state[id]?.resolutions,
              [dataStream.resolution]: {
                ...state[id]?.resolutions?.[dataStream.resolution],
                [AggregateType.AVERAGE]: newStreamStore,
              },
            }
          : state[id]?.resolutions || undefined;
      const newRawData =
        dataStream.resolution === 0 ? { ...state[id]?.rawData, ...newStreamStore } : state[id]?.rawData || undefined;

      return {
        ...state,
        [id]: {
          ...state[id],
          resolutions: newResolutions,
          rawData: newRawData,
        },
      };
    }

    case ERROR: {
      const { id, error, resolution } = action.payload;
      const aggregationType = resolution === 0 ? undefined : AggregateType.AVERAGE;
      // defaulting to AVERAGE because its only type we support at the moment

      const streamStore = getDataStreamStore(id, resolution, state, aggregationType);

      const newStreamStore = {
        ...streamStore,
        resolution,
        aggregationType,
        requestHistory: streamStore ? streamStore.requestHistory : [],
        dataCache: (streamStore && streamStore.dataCache) || EMPTY_CACHE,
        requestCache: (streamStore && streamStore.requestCache) || EMPTY_CACHE,
        id,
        error,
        isLoading: false,
        isRefreshing: false,
      };

      const newResolutions = aggregationType
        ? {
            ...state[id]?.resolutions,
            [resolution]: {
              ...state[id]?.resolutions?.[resolution],
              [aggregationType]: newStreamStore,
            },
          }
        : state[id]?.resolutions || undefined;
      const newRawData = !aggregationType
        ? { ...state[id]?.rawData, ...newStreamStore }
        : state[id]?.rawData || undefined;

      return {
        ...state,
        [id]: {
          ...state[id],
          resolutions: newResolutions,
          rawData: newRawData,
        },
      };
    }

    default: {
      return state;
    }
  }
};

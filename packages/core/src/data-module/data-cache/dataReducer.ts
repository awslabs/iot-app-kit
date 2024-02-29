import { ERROR, REQUEST, SUCCESS } from './dataActions';
import { getDataStreamStore } from './getDataStreamStore';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';
import { mergeHistoricalRequests } from './mergeHistoricalRequests';
import { parseDuration } from '../../common/time';
import type { Reducer } from 'redux';
import type { AsyncActions } from './dataActions';
import type { DataStreamsStore } from './types';

/**
 * Data Reducer
 *
 * Manages error status, loading status, and indexed data points
 */

export const dataReducer: Reducer<DataStreamsStore, AsyncActions> = (
  state: DataStreamsStore = {},
  action: AsyncActions
): DataStreamsStore => {
  let outGoingrequests = 0;
  switch (action.type) {
    case REQUEST: {
      const {
        id,
        resolution,
        aggregationType,
        start,
        end,
        fetchFromStartToEnd,
      } = action.payload;
      const streamStore = getDataStreamStore(
        id,
        resolution,
        state,
        aggregationType
      );
      const dataCache =
        streamStore != null ? streamStore.dataCache : EMPTY_CACHE;
      const requestCache =
        streamStore != null ? streamStore.requestCache : EMPTY_CACHE;
      const existingRequestHistory = streamStore
        ? streamStore.requestHistory
        : [];

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
        isRefreshing: true,
        numOutgoingRequests: ++outGoingrequests,
      };

      const newResolutions =
        numericResolution != 0 && aggregationType
          ? {
              ...state[id]?.resolutions,
              [numericResolution]: {
                ...state[id]?.resolutions?.[numericResolution],
                [aggregationType]: newStreamStore,
              },
            }
          : state[id]?.resolutions || undefined;
      const newRawData =
        numericResolution === 0
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

    case SUCCESS: {
      const {
        id,
        data: dataStream,
        first,
        last,
        requestInformation,
      } = action.payload;
      const {
        aggregationType,
        fetchFromStartToEnd,
        fetchMostRecentBeforeEnd,
        fetchMostRecentBeforeStart,
      } = requestInformation;
      const streamStore = getDataStreamStore(
        id,
        dataStream.resolution,
        state,
        aggregationType
      );
      // Updating request cache is a hack to deal with latest value update
      // TODO: clean this to one single source of truth cache
      const requestCache =
        streamStore != null ? streamStore.requestCache : EMPTY_CACHE;

      // We always want data in ascending order in the cache
      const sortedData = dataStream.data.sort((a, b) => a.x - b.x);

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
        (fetchMostRecentBeforeStart || fetchMostRecentBeforeEnd) &&
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

      const existingRequestHistory = streamStore
        ? streamStore.requestHistory
        : [];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, ...restOfDataStream } = dataStream;

      const noOfOutGoingrequest = --outGoingrequests;

      const newStreamStore = {
        ...streamStore,
        ...restOfDataStream,
        requestHistory: mergeHistoricalRequests(existingRequestHistory, {
          start: intervalStart,
          end: last,
          requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
        }),
        requestCache: !fetchFromStartToEnd
          ? addToDataPointCache({
              cache: requestCache,
              start: intervalStart,
              end: last,
            })
          : requestCache,
        dataCache: updatedDataCache,
        isLoading: false,
        numOutgoingRequests: noOfOutGoingrequest,
        isRefreshing: noOfOutGoingrequest > 0,
        error: undefined,
      };

      const newResolutions =
        dataStream.resolution != 0 && aggregationType
          ? {
              ...state[id]?.resolutions,
              [dataStream.resolution]: {
                ...state[id]?.resolutions?.[dataStream.resolution],
                [aggregationType]: newStreamStore,
              },
            }
          : state[id]?.resolutions || undefined;
      const newRawData =
        dataStream.resolution === 0
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

    case ERROR: {
      const { id, error, resolution, aggregationType } = action.payload;

      const streamStore = getDataStreamStore(
        id,
        resolution,
        state,
        aggregationType
      );

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
        numOutgoingRequests: --outGoingrequests,
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

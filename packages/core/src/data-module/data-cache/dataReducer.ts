import { Reducer } from 'redux';

import { AsyncActions, ERROR, REQUEST, SUCCESS } from './dataActions';
import { getDataStreamStore } from './getDataStreamStore';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';

import { DataStreamsStore } from './types';
import { mergeHistoricalRequests } from './mergeHistoricalRequests';
import { getDataPoints } from '../../common/getDataPoints';

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
      const { id, resolution, first, last, request } = action.payload;
      const streamStore = getDataStreamStore(id, resolution, state);
      const dataCache = streamStore != null ? streamStore.dataCache : EMPTY_CACHE;
      const requestCache = streamStore != null ? streamStore.requestCache : EMPTY_CACHE;
      const existingRequestHistory = streamStore ? streamStore.requestHistory : [];

      // We only consider it loading if data has not been requested before, or if it's already loading.
      const isLoading = streamStore == null || streamStore.isLoading;

      return {
        ...state,
        [id]: {
          ...state[id],
          [resolution]: {
            ...streamStore,
            resolution,
            requestHistory: request.settings?.fetchFromStartToEnd
              ? mergeHistoricalRequests(existingRequestHistory, {
                  start: first,
                  end: last,
                  requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
                })
              : existingRequestHistory,
            dataCache,
            requestCache: request.settings?.fetchFromStartToEnd
              ? addToDataPointCache({
                  cache: requestCache,
                  start: first,
                  end: last,
                })
              : requestCache,
            id,
            isLoading,
            isRefreshing: false,
          },
        },
      };
    }

    case SUCCESS: {
      const { id, data, first, last, typeOfRequest } = action.payload;
      const streamStore = getDataStreamStore(id, data.resolution, state);
      // Updating request cache is a hack to deal with latest value update
      // TODO: clean this to one single source of truth cache
      const requestCache = streamStore != null ? streamStore.requestCache : EMPTY_CACHE;

      // We always want data in ascending order in the cache
      const sortedData = getDataPoints(data, data.resolution).sort((a, b) => a.x - b.x);
      /**
       * Based on the type of request, determine the actual range requested.
       *
       * For instance, when we fetch latest value, we stop looking for data when we find the first point, and potentially seek beyond the start of the viewport.
       * This must be taken into account.
       */

      const updatedDataCache = addToDataPointCache({
        start: first,
        end: last,
        data: sortedData,
        cache: (streamStore && streamStore.dataCache) || EMPTY_CACHE,
      });

      const existingRequestHistory = streamStore ? streamStore.requestHistory : [];

      return {
        ...state,
        [id]: {
          ...state[id],
          [data.resolution]: {
            ...streamStore,
            resolution: data.resolution,
            id,
            requestHistory: mergeHistoricalRequests(existingRequestHistory, {
              start: first,
              end: last,
              requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
            }),
            requestCache:
              typeOfRequest !== 'fetchFromStartToEnd'
                ? addToDataPointCache({
                    cache: requestCache,
                    start: first,
                    end: last,
                  })
                : requestCache,
            dataCache: updatedDataCache,
            isLoading: false,
            isRefreshing: false,
            error: undefined,
          },
        },
      };
    }

    case ERROR: {
      const { id, error, resolution } = action.payload;
      const streamStore = getDataStreamStore(id, resolution, state);
      return {
        ...state,
        [id]: {
          ...state[id],
          [resolution]: {
            ...streamStore,
            resolution,
            requestHistory: streamStore ? streamStore.requestHistory : [],
            dataCache: (streamStore && streamStore.dataCache) || EMPTY_CACHE,
            requestCache: (streamStore && streamStore.requestCache) || EMPTY_CACHE,
            id,
            error,
            isLoading: false,
            isRefreshing: false,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
};

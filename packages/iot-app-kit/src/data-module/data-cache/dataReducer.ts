import { Reducer } from 'redux';

import { AsyncActions, ERROR, REQUEST, SUCCESS } from './dataActions';
import { getDataStreamStore } from './getDataStreamStore';
import { addToDataPointCache, EMPTY_CACHE } from './caching/caching';

import { DataStreamsStore } from './types';
import { mergeHistoricalRequests } from './mergeHistoricalRequests';
import { getDataPoints } from '../../utils/getDataPoints';

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
      const { id, resolution, first, last } = action.payload;
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
            requestHistory: mergeHistoricalRequests(existingRequestHistory, {
              start: first,
              end: last,
              requestedAt: new Date(Date.now()), // Date.now utilized in this funny way to assist mocking in the unit tests
            }),
            dataCache,
            requestCache: addToDataPointCache({
              cache: requestCache,
              start: first,
              end: last,
            }),
            id,
            isLoading,
            isRefreshing: true,
          },
        },
      };
    }

    case SUCCESS: {
      const { id, data, first, last } = action.payload;
      const streamStore = getDataStreamStore(id, data.resolution, state);
      // Updating request cache is a hack to deal with latest value update
      // TODO: clean this to one single source of truth cache
      const requestCache = streamStore != null ? streamStore.requestCache : EMPTY_CACHE;

      const updatedDataCache = addToDataPointCache({
        start: first,
        end: last,
        data: getDataPoints(data, data.resolution),
        cache: (streamStore && streamStore.dataCache) || EMPTY_CACHE,
      });

      const updatedRequestCache = addToDataPointCache({
        cache: requestCache,
        start: first,
        end: last,
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
            requestCache: updatedRequestCache,
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

import { DATA_TYPE, TimeSeriesData, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';

const noop = () => {};
export const mockTimeSeriesDataQuery = (
  initialResponse: TimeSeriesData[],
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        query: initialResponse,
      }),
    build: () => ({
      subscribe: ({ next }) => {
        next(initialResponse);
      },
      unsubscribe: () => {
        unsubscribe();
      },
      updateViewport: (viewport) => {
        updateViewport(viewport);
      },
    }),
  };
};
export const mockTimeSeriesDataQueryWithError = (
  errorMsg: string,
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock-err-response',
        query: errorMsg,
      }),
    build: () => ({
      subscribe: ({ next }) => {
        next([
          {
            dataStreams: [
              {
                id: 'some-error-data-stream-id',
                name: 'some-error-data-stream',
                dataType: DATA_TYPE.NUMBER,
                error: { msg: errorMsg },
                data: [],
                resolution: 0,
                color: 'black',
              },
            ],
            thresholds: [],
            viewport: { duration: '1m' },
          },
        ]);
      },
      unsubscribe: () => {
        unsubscribe();
      },
      updateViewport: (viewport) => {
        updateViewport(viewport);
      },
    }),
  };
};

export const mockTimeSeriesDataQueryLoading = (overrides?: {
  updateViewport?: (viewport: Viewport) => void;
  unsubscribe?: () => void;
}): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock-loading-response',
        query: Date.now(),
      }),
    build: () => ({
      subscribe: ({ next }) => {
        next([
          {
            dataStreams: [
              {
                id: 'some-loading-data-stream-id',
                dataType: DATA_TYPE.NUMBER,
                name: 'some-loading-data-stream',
                data: [],
                resolution: 0,
                color: 'black',
                isLoading: true,
              },
            ],
            thresholds: [],
            viewport: { duration: '1m' },
          },
        ]);
      },
      unsubscribe: () => {
        unsubscribe();
      },
      updateViewport: (viewport) => {
        updateViewport(viewport);
      },
    }),
  };
};

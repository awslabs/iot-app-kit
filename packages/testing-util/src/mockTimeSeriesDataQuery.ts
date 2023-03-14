import { TimeSeriesData, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';

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

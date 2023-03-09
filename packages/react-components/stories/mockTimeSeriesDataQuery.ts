import { TimeSeriesData, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { v4 } from 'uuid';

const noop = () => {};
export const mockTimeSeriesDataQuery = (
  initialResponse: TimeSeriesData[],
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): TimeSeriesDataQuery => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  const id = v4();
  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        query: initialResponse,
      }),
    build: () => ({
      subscribe: ({ next }) => {
        console.debug('subscribed to: ', id);
        next(initialResponse);
      },
      unsubscribe: () => {
        console.debug('unsubscribed from: ', id);
        unsubscribe();
      },
      updateViewport: (viewport) => {
        console.debug('unsubscribed from: ', id);
        updateViewport(viewport);
      },
    }),
  };
};

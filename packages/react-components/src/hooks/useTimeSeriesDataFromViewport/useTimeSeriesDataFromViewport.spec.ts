import { renderHook } from '@testing-library/react-hooks';
import { useTimeSeriesDataFromViewport } from './useTimeSeriesDataFromViewport';

import { DataStream, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, Viewport } from '@iot-app-kit/core';

const noop = () => {};
const queryCreator = (
  timeSeriesData: TimeSeriesData[],
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};
  return {
    build: () => ({
      subscribe: ({ next }) => {
        next(timeSeriesData);
      },
      unsubscribe,
      updateViewport,
    }),
  };
};

it('returns no time series data when query returns no time series data', () => {
  const query = queryCreator([]);
  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesDataFromViewport({
      query,
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([]);
  expect(timeSeriesData.annotations).toEqual({});
  expect(timeSeriesData.viewport).toEqual({ duration: '5m' });
});

it('provides time series data returned from query', () => {
  const QUERY_RESPONSE: TimeSeriesData[] = [{ dataStreams: [], viewport: { duration: '5m' }, annotations: { y: [] } }];
  const query = queryCreator(QUERY_RESPONSE);
  const viewport = { duration: '5m' };

  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesDataFromViewport({
      query,
      viewport,
    })
  );

  expect(timeSeriesData).toEqual(QUERY_RESPONSE[0]);
});

it('binds style settings color to the data stream color', () => {
  const DATA_STREAM: DataStream = { refId: 'red', id: 'abc', data: [], resolution: 0, name: 'my-name' };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    annotations: {},
  };
  const query = queryCreator([TIME_SERIES_DATA]);
  const color = 'red';

  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesDataFromViewport({
      query,
      viewport: { duration: '5m' },
      styles: { red: { color } },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([{ ...DATA_STREAM, color }]);
});

it('combines multiple time series data results into a single time series data', () => {
  // TODO: write
});

// Not implemented
it.skip('providers updated viewport to query', () => {
  let viewport = { duration: '5m' };
  const updateViewport = jest.fn();
  const DATA_STREAM: DataStream = { refId: 'red', id: 'abc', data: [], resolution: 0, name: 'my-name' };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    annotations: {},
  };

  const query = queryCreator([TIME_SERIES_DATA], { updateViewport });
  const color = 'red';

  const { rerender } = renderHook(() =>
    useTimeSeriesDataFromViewport({
      query,
      viewport,
      styles: { red: { color } },
    })
  );

  expect(updateViewport).not.toBeCalled();

  viewport = { duration: '100m' };

  rerender();

  expect(updateViewport).toBeCalledTimes(1);
  expect(updateViewport).toBeCalledWith(viewport);
});

it.skip('does not attempt to re-create the subscription when provided a new reference to an unchanged query', () => {
  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesDataFromViewport({
      query: queryCreator([]),
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([]);
  expect(timeSeriesData.annotations).toEqual({});
  expect(timeSeriesData.viewport).toEqual({ duration: '5m' });
});

import { renderHook } from '@testing-library/react';
import { DataStream, TimeQuery, TimeSeriesData, TimeSeriesDataRequest, Viewport } from '@iot-app-kit/core';
import { useTimeSeriesData } from './useTimeSeriesData';

const noop = () => {};

const queryCreator = (
  timeSeriesData: TimeSeriesData[],
  overrides?: { updateViewport?: (viewport: Viewport) => void; unsubscribe?: () => void }
): TimeQuery<TimeSeriesData[], TimeSeriesDataRequest> => {
  const { updateViewport = noop, unsubscribe = noop } = overrides || {};

  return {
    toQueryString: () =>
      JSON.stringify({
        source: 'mock',
        query: timeSeriesData,
      }),
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
  const queries = [queryCreator([])];
  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([]);
});

it('provides time series data returned from query', () => {
  const QUERY_RESPONSE: TimeSeriesData[] = [{ dataStreams: [], viewport: { duration: '5m' }, annotations: { y: [] } }];
  const queries = [queryCreator(QUERY_RESPONSE)];
  const viewport = { duration: '5m' };

  const {
    result: { current },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport,
    })
  );

  expect(current.dataStreams).toEqual(QUERY_RESPONSE[0].dataStreams);
});

it('binds style settings color to the data stream color', () => {
  const DATA_STREAM: DataStream = { refId: 'red', id: 'abc', data: [], resolution: 0, name: 'my-name' };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    annotations: {},
  };
  const queries = [queryCreator([TIME_SERIES_DATA])];
  const color = 'red';

  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport: { duration: '5m' },
      styles: { red: { color } },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([{ ...DATA_STREAM, color }]);
});

it('combines multiple time series data results into a single time series data', () => {
  const DATA_STREAM_1: DataStream = { refId: 'red', id: 'abc-1', data: [], resolution: 0, name: 'my-name' };
  const DATA_STREAM_2: DataStream = { refId: 'red', id: 'abc-2', data: [], resolution: 0, name: 'my-name' };

  const QUERY_RESPONSE: TimeSeriesData[] = [
    { dataStreams: [DATA_STREAM_1], viewport: { duration: '5m' }, annotations: { y: [] } },
    { dataStreams: [DATA_STREAM_2], viewport: { duration: '5m' }, annotations: { y: [] } },
  ];
  const queries = [queryCreator(QUERY_RESPONSE)];
  const viewport = { duration: '5m' };

  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport,
    })
  );

  expect(timeSeriesData).toEqual({
    dataStreams: [DATA_STREAM_1, DATA_STREAM_2],
  });
});

it('returns data streams from multiple queries', () => {
  const DATA_STREAM_1: DataStream = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };
  const DATA_STREAM_2: DataStream = { id: 'abc-2', data: [], resolution: 0, name: 'my-name-2' };

  const QUERY_RESPONSE_1: TimeSeriesData[] = [
    { dataStreams: [DATA_STREAM_1], viewport: { duration: '5m' }, annotations: { y: [] } },
  ];
  const QUERY_RESPONSE_2: TimeSeriesData[] = [
    { dataStreams: [DATA_STREAM_2], viewport: { duration: '5m' }, annotations: { y: [] } },
  ];

  const queries = [queryCreator(QUERY_RESPONSE_1), queryCreator(QUERY_RESPONSE_2)];

  const {
    result: {
      current: { dataStreams },
    },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport: { duration: '5m' },
    })
  );

  expect(dataStreams).toEqual([DATA_STREAM_1, DATA_STREAM_2]);
});

it('providers updated viewport to query', () => {
  let viewport = { duration: '5m' };
  const updateViewport = jest.fn();
  const DATA_STREAM: DataStream = { refId: 'red', id: 'abc', data: [], resolution: 0, name: 'my-name' };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    annotations: {},
  };

  const queries = [queryCreator([TIME_SERIES_DATA], { updateViewport })];
  const color = 'red';

  const { rerender } = renderHook(() =>
    useTimeSeriesData({
      queries,
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

it('does not attempt to re-create the subscription when provided a new reference to an unchanged query', () => {
  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesData({
      queries: [queryCreator([])],
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([]);
});

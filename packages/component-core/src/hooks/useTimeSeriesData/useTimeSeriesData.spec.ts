import { renderHook } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { useTimeSeriesData } from './useTimeSeriesData';
import type { DataStream, TimeSeriesData, Threshold } from '@iot-app-kit/core';

it('returns no time series data when query returns no time series data', () => {
  const queries = [mockTimeSeriesDataQuery([])];
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
  const QUERY_RESPONSE: TimeSeriesData[] = [
    { dataStreams: [], viewport: { duration: '5m' }, thresholds: [] },
  ];
  const queries = [mockTimeSeriesDataQuery(QUERY_RESPONSE)];
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

it('returns time series data when the number of time series queries changes', () => {
  const THRESHOLD_1: Threshold = {
    comparisonOperator: 'GT',
    value: 10,
    color: 'black',
  };
  const THRESHOLD_2: Threshold = {
    comparisonOperator: 'GT',
    value: 100,
    color: 'black',
  };

  const DATA_STREAM_1: DataStream = {
    refId: 'red',
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };
  const DATA_STREAM_2: DataStream = {
    refId: 'red',
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };

  const QUERY_1 = {
    dataStreams: [DATA_STREAM_1],
    viewport: { duration: '5m' },
    thresholds: [THRESHOLD_1],
  };
  const QUERY_2 = {
    dataStreams: [DATA_STREAM_2],
    viewport: { duration: '5m' },
    thresholds: [THRESHOLD_2],
  };

  const INITIAL_QUERIES = [mockTimeSeriesDataQuery([QUERY_1])];
  const UPDATED_QUERIES = [
    mockTimeSeriesDataQuery([QUERY_1]),
    mockTimeSeriesDataQuery([QUERY_2]),
  ];

  const VIEWPORT = { duration: '5m' };

  const { result, rerender } = renderHook(
    (queries) => useTimeSeriesData({ queries, viewport: VIEWPORT }),
    {
      initialProps: INITIAL_QUERIES,
    }
  );

  expect(result.current).toEqual({
    dataStreams: [DATA_STREAM_1],
    thresholds: [THRESHOLD_1],
  });

  rerender(UPDATED_QUERIES);

  expect(result.current).toEqual({
    dataStreams: [DATA_STREAM_1, DATA_STREAM_2],
    thresholds: [THRESHOLD_1, THRESHOLD_2],
  });
});

// TODO: Fix this test
it.skip('returns time series data when the number of queries within one time series query changes', () => {
  const THRESHOLD_1: Threshold = {
    comparisonOperator: 'GT',
    value: 10,
    color: 'black',
  };
  const THRESHOLD_2: Threshold = {
    comparisonOperator: 'GT',
    value: 100,
    color: 'black',
  };

  const DATA_STREAM_1: DataStream = {
    refId: 'red',
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };
  const DATA_STREAM_2: DataStream = {
    refId: 'red',
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };

  const QUERY_1 = {
    dataStreams: [DATA_STREAM_1],
    viewport: { duration: '5m' },
    thresholds: [THRESHOLD_1],
  };
  const QUERY_2 = {
    dataStreams: [DATA_STREAM_2],
    viewport: { duration: '5m' },
    thresholds: [THRESHOLD_2],
  };

  const INITIAL_QUERIES = [mockTimeSeriesDataQuery([QUERY_1])];
  const UPDATED_QUERIES = [mockTimeSeriesDataQuery([QUERY_1, QUERY_2])];

  const VIEWPORT = { duration: '5m' };

  const { result, rerender } = renderHook(
    (queries) => useTimeSeriesData({ queries, viewport: VIEWPORT }),
    {
      initialProps: INITIAL_QUERIES,
    }
  );

  expect(result.current).toEqual({
    dataStreams: [DATA_STREAM_1],
    thresholds: [THRESHOLD_1],
  });

  rerender(UPDATED_QUERIES);

  expect(result.current).toEqual({
    dataStreams: [DATA_STREAM_1, DATA_STREAM_2],
    thresholds: [THRESHOLD_1, THRESHOLD_2],
  });
});

it('binds style settings color to the data stream color', () => {
  const DATA_STREAM: DataStream = {
    refId: 'red',
    id: 'abc',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    thresholds: [],
  };
  const queries = [mockTimeSeriesDataQuery([TIME_SERIES_DATA])];
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
  const THRESHOLD_1: Threshold = {
    comparisonOperator: 'GT',
    value: 10,
    color: 'black',
  };
  const THRESHOLD_2: Threshold = {
    comparisonOperator: 'GT',
    value: 100,
    color: 'black',
  };
  const DATA_STREAM_1: DataStream = {
    refId: 'red',
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };
  const DATA_STREAM_2: DataStream = {
    refId: 'red',
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };

  const QUERY_RESPONSE: TimeSeriesData[] = [
    {
      dataStreams: [DATA_STREAM_1],
      viewport: { duration: '5m' },
      thresholds: [THRESHOLD_1],
    },
    {
      dataStreams: [DATA_STREAM_2],
      viewport: { duration: '5m' },
      thresholds: [THRESHOLD_2],
    },
  ];
  const queries = [mockTimeSeriesDataQuery(QUERY_RESPONSE)];
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
    thresholds: [THRESHOLD_1, THRESHOLD_2],
  });
});

it('returns data streams from multiple queries', () => {
  const DATA_STREAM_1: DataStream = {
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
    color: 'black',
  };
  const DATA_STREAM_2: DataStream = {
    id: 'abc-2',
    data: [],
    resolution: 0,
    name: 'my-name-2',
    color: 'black',
  };

  const QUERY_RESPONSE_1: TimeSeriesData[] = [
    {
      dataStreams: [DATA_STREAM_1],
      viewport: { duration: '5m' },
      thresholds: [],
    },
  ];
  const QUERY_RESPONSE_2: TimeSeriesData[] = [
    {
      dataStreams: [DATA_STREAM_2],
      viewport: { duration: '5m' },
      thresholds: [],
    },
  ];

  const queries = [
    mockTimeSeriesDataQuery(QUERY_RESPONSE_1),
    mockTimeSeriesDataQuery(QUERY_RESPONSE_2),
  ];

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
  const updateViewport = vi.fn();
  const DATA_STREAM: DataStream = {
    refId: 'red',
    id: 'abc',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    thresholds: [],
  };

  const queries = [
    mockTimeSeriesDataQuery([TIME_SERIES_DATA], { updateViewport }),
  ];
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
      queries: [mockTimeSeriesDataQuery([])],
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.dataStreams).toEqual([]);
});

it('returns thresholds from time series data provider', () => {
  const THRESHOLD: Threshold = {
    comparisonOperator: 'GT',
    value: 10,
    color: 'black',
  };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [],
    viewport: { duration: '5m' },
    thresholds: [THRESHOLD],
  };
  const queries = [mockTimeSeriesDataQuery([TIME_SERIES_DATA])];
  const {
    result: { current: timeSeriesData },
  } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport: { duration: '5m' },
    })
  );

  expect(timeSeriesData.thresholds).toEqual([THRESHOLD]);
});

it('update datastream styles when styles change', () => {
  const DATA_STREAM: DataStream = {
    refId: 'ref-id',
    id: 'abc',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const TIME_SERIES_DATA: TimeSeriesData = {
    dataStreams: [DATA_STREAM],
    viewport: { duration: '5m' },
    thresholds: [],
  };

  const queries = [mockTimeSeriesDataQuery([TIME_SERIES_DATA])];
  let styles = { 'ref-id': { color: 'red' } };
  const { rerender, result } = renderHook(() =>
    useTimeSeriesData({
      queries,
      viewport: { duration: '5m' },
      styles,
    })
  );
  styles = { 'ref-id': { color: 'green' } };
  rerender();

  expect(result.current.dataStreams[0]).toEqual(
    expect.objectContaining({ color: 'green' })
  );
});

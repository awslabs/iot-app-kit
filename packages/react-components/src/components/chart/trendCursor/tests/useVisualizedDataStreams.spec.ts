import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { useVisualizedDataStreams } from '../../hooks/useVisualizedDataStreams';
import { DataStream } from '@iot-app-kit/core';
import { renderHook } from '@testing-library/react';

it('converts empty query to empty data stream', async () => {
  const VIEWPORT = { duration: '5m' };
  const {
    result: { current },
  } = renderHook(() => useVisualizedDataStreams([], VIEWPORT));

  expect(current.dataStreams).toBeArrayOfSize(0);
});

it('convert query to visualized data stream', async () => {
  const VIEWPORT = { duration: '5m' };
  const DATA_STREAM: DataStream = {
    id: 'abc-1',
    data: [],
    resolution: 0,
    name: 'my-name',
  };
  const queries = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      thresholds: [],
    },
  ]);

  const {
    result: { current },
  } = renderHook(() => useVisualizedDataStreams([queries], VIEWPORT));

  expect(current).toHaveProperty('dataStreams[0].id', DATA_STREAM.id);
  expect(current).toHaveProperty('isLoading', false);
});

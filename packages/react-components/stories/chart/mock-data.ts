import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DATA_TYPE, DAY_IN_MS } from '@iot-app-kit/core';
import type { DataStream } from '@iot-app-kit/core';

const NUM_STREAMS = 2;
export const VIEWPORT = { start: new Date(2000, 0, 0), end: new Date(2010, 0, 0) };

const DATA_STREAM: DataStream = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

export const MOCK_TIME_SERIES_DATA_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: new Array(NUM_STREAMS + 1).fill(0).map((_, i) => ({
      ...DATA_STREAM,
      data: [
        { x: new Date(2000, 5, 13).getTime(), y: (10 * i) ^ 2 },
        { x: new Date(2005, 6, 13).getTime(), y: (2 * (10 * i)) ^ 2 },
      ],
      name: `stream-${i}`,
      id: i.toString(),
    })),
    thresholds: [],
    viewport: VIEWPORT,
  },
]);

export const MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: new Array(NUM_STREAMS + 1).fill(0).map((_, i) => ({
      ...DATA_STREAM,
      name: `stream-${i}`,
      id: i.toString(),
      resolution: DAY_IN_MS * 300,
      aggregates: {
        [DAY_IN_MS * 300]: [{ x: new Date(2000, 5, 13).getTime(), y: (10 * i) ^ 2 }],
      },
    })),
    thresholds: [],
    viewport: VIEWPORT,
  },
]);

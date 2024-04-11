import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DATA_TYPE, DAY_IN_MS } from '@iot-app-kit/core';
import type { DataStream } from '@iot-app-kit/core';

export const VIEWPORT = {
  start: new Date(2000, 0, 0),
  end: new Date(2010, 0, 0),
};

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
    dataStreams: [
      {
        ...DATA_STREAM,
        data: [
          {
            x: new Date(2005, 6, 13).getTime(),
            y: 44.231262121,
            quality: 'BAD',
          },
        ],
        unit: 'rpm',
        name: `stream-1`,
        refId: `stream-1`,
        id: '1',
      },
    ],
    thresholds: [],
    viewport: VIEWPORT,
  },
]);

export const MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY = mockTimeSeriesDataQuery([
  {
    dataStreams: [
      {
        ...DATA_STREAM,
        name: `stream-2`,
        id: '2',
        resolution: DAY_IN_MS * 300,
        aggregationType: 'AVERAGE',
        unit: 'MPH',
        data: [
          {
            x: new Date(2000, 5, 13).getTime(),
            y: (10 * 8) ^ 2,
            quality: 'UNCERTAIN',
          },
        ],
      },
    ],
    thresholds: [],
    viewport: VIEWPORT,
  },
]);

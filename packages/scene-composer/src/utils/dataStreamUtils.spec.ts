import { TimeSeriesData } from '@iot-app-kit/core';

import {
  booleanStream,
  end,
  labels,
  numberStream,
  start,
  streamId,
  stringStream,
  viewport,
} from '../../tests/data/mockDataStreams';
import { IDataField, IDataInput } from '../interfaces';

import { convertDataStreamsToDataInput, combineTimeSeriesData } from './dataStreamUtils';

describe('convertDataStreamsToDataInput', () => {
  it('should convert data streams to data input correctly', () => {
    const timeField: IDataField = {
      name: 'time',
      valueType: 'time',
      labels,
      values: [start.getTime(), end.getTime()],
    };
    const expectedDataInput: IDataInput = {
      timeRange: {
        from: start.getTime(),
        to: end.getTime(),
      },
      dataFrames: [
        {
          dataFrameId: streamId,
          fields: [
            timeField,
            {
              name: 'test',
              valueType: 'number',
              labels,
              values: [1, 2],
            },
          ],
        },
        {
          dataFrameId: streamId,
          fields: [
            timeField,
            {
              name: 'test',
              valueType: 'string',
              labels,
              values: ['xxx', 'yyy'],
            },
          ],
        },
        {
          dataFrameId: streamId,
          fields: [
            timeField,
            {
              name: 'test',
              valueType: 'boolean',
              labels,
              values: [true, false],
            },
          ],
        },
      ],
    };

    expect(convertDataStreamsToDataInput([numberStream, stringStream, booleanStream], viewport)).toEqual(
      expectedDataInput,
    );
  });
});

describe('combineTimeSeriesData', () => {
  it('should combine data streams to correctly', () => {
    const input: TimeSeriesData[] = [
      {
        dataStreams: [numberStream],
        viewport: { start, end: start },
      },
      {
        dataStreams: [booleanStream],
        viewport: { start: end, end },
      },
      {
        dataStreams: [stringStream],
        viewport,
      },
    ];
    const expected: TimeSeriesData = {
      dataStreams: [numberStream, booleanStream, stringStream],
      viewport,
    };

    expect(combineTimeSeriesData(input)).toEqual(expected);
  });
});

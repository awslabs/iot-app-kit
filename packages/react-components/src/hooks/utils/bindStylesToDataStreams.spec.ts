import { expect, it } from '@jest/globals';
import { bindStylesToDataStreams } from './bindStylesToDataStreams';
import type { DataStream } from '@iot-app-kit/core';

export const DATA_STREAM: DataStream = {
  id: 'some-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: 'NUMBER',
  data: [],
};

export const DATA_STREAM_2: DataStream = {
  id: 'some-other-id',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: 'NUMBER',
  data: [],
};

it('returns empty array when provided no data streams', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([]);
});

it('returns data streams when no matching styles', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [DATA_STREAM],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([DATA_STREAM]);
});

it('associates styles to corresponding data stream', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle', color: 'red' }]);
});

it('associates styles to corresponding data stream for multiple data streams', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [
        { ...DATA_STREAM, refId: 'someStyle' },
        { ...DATA_STREAM_2, refId: 'someStyle2' },
      ],
      styleSettings: {
        someStyle: { color: 'red' },
        someStyle2: { color: 'blue' },
      },
    })
  ).toEqual([
    { ...DATA_STREAM, refId: 'someStyle', color: 'red' },
    { ...DATA_STREAM_2, refId: 'someStyle2', color: 'blue' },
  ]);
});

it('returns data stream when no matching refId', () => {
  expect(
    bindStylesToDataStreams({
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle100' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle100' }]);
});

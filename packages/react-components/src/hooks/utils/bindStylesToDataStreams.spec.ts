import { expect, it } from '@jest/globals';
import { bindStylesToDataStreams } from './bindStylesToDataStreams';
import type { DataStream } from '@iot-app-kit/core';
import { colorPalette } from '@iot-app-kit/core-util';

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
      assignDefaultColors: false,
      dataStreams: [],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([]);
});

it('returns data streams when no matching styles', () => {
  expect(
    bindStylesToDataStreams({
      assignDefaultColors: false,
      dataStreams: [DATA_STREAM],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([DATA_STREAM]);
});

it('associates styles to corresponding data stream', () => {
  expect(
    bindStylesToDataStreams({
      assignDefaultColors: false,
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle', color: 'red' }]);
});

it('associates styles to corresponding data stream for multiple data streams', () => {
  expect(
    bindStylesToDataStreams({
      assignDefaultColors: false,
      dataStreams: [
        { ...DATA_STREAM, refId: 'someStyle' },
        { ...DATA_STREAM_2, refId: 'someStyle2' },
      ],
      styleSettings: { someStyle: { color: 'red' }, someStyle2: { color: 'blue' } },
    })
  ).toEqual([
    { ...DATA_STREAM, refId: 'someStyle', color: 'red' },
    { ...DATA_STREAM_2, refId: 'someStyle2', color: 'blue' },
  ]);
});

it('returns data stream when no matching refId', () => {
  expect(
    bindStylesToDataStreams({
      assignDefaultColors: false,
      dataStreams: [{ ...DATA_STREAM, refId: 'someStyle100' }],
      styleSettings: { someStyle: { color: 'red' } },
    })
  ).toEqual([{ ...DATA_STREAM, refId: 'someStyle100' }]);
});

describe('assignDefaultColors', () => {
  it('does not assign color when set to false', () => {
    expect(
      bindStylesToDataStreams({
        assignDefaultColors: false,
        dataStreams: [{ ...DATA_STREAM, color: undefined }],
        styleSettings: {},
      })
    ).toEqual([expect.objectContaining({ color: undefined })]);
  });

  it('does not assign color when color on styleSettings is specified', () => {
    expect(
      bindStylesToDataStreams({
        assignDefaultColors: true,
        dataStreams: [{ ...DATA_STREAM, refId: 'someStyle', color: undefined }],
        styleSettings: { someStyle: { color: 'some-color' } },
      })
    ).toEqual([expect.objectContaining({ color: 'some-color' })]);
  });

  it('does not assign color when color on datastream', () => {
    expect(
      bindStylesToDataStreams({
        assignDefaultColors: true,
        dataStreams: [{ ...DATA_STREAM, color: 'some-color' }],
        styleSettings: {},
      })
    ).toEqual([expect.objectContaining({ color: 'some-color' })]);
  });

  it('does assign color when no color specified by data stream or style setting', () => {
    expect(
      bindStylesToDataStreams({
        assignDefaultColors: true,
        dataStreams: [{ ...DATA_STREAM, color: undefined }],
        styleSettings: {},
      })
    ).toEqual([expect.objectContaining({ color: colorPalette[0] })]);
  });
});

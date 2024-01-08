import { toDataPoint, toDataStream } from './values';

describe('toDataPoint', () => {
  it('should return undefined when input is not defined', () => {
    expect(toDataPoint(undefined)).toBeUndefined();
  });

  it('should return undefined when value or time is not defined', () => {
    expect(toDataPoint({ value: undefined, time: 'time' })).toBeUndefined();
    expect(
      toDataPoint({ value: { integerValue: 1 }, time: undefined })
    ).toBeUndefined();
    expect(
      toDataPoint({ value: { integerValue: undefined }, time: 'time' })
    ).toBeUndefined();
  });

  it('should return expected dataPoint', () => {
    const timeString = '2022/01/01 12:20:30';
    expect(
      toDataPoint({
        value: { integerValue: 1 },
        time: new Date(timeString).toISOString(),
      })
    ).toEqual({
      x: new Date(timeString).getTime(),
      y: 1,
    });
  });
});

describe('toDataStream', () => {
  it('should return expected data stream as isRefreshing', () => {
    const meta = {
      entityId: 'entity',
      componentName: 'comp',
      propertyName: 'prop',
    };
    const input = {
      streamId: 'test-stream',
      dataPoints: [{ x: 123456, y: 'value' }],
      ...meta,
      nextToken: 'abc',
      fetchMostRecent: false,
    };
    expect(toDataStream(input)).toEqual({
      id: input.streamId,
      data: input.dataPoints,
      resolution: 0,
      meta,
      isRefreshing: true,
    });
  });

  it('should return expected data stream as not isRefreshing when nextToken is undefined', () => {
    const meta = {
      entityId: 'entity',
      componentName: 'comp',
      propertyName: 'prop',
    };
    const input = {
      streamId: 'test-stream',
      dataPoints: [{ x: 123456, y: 'value' }],
      ...meta,
      nextToken: undefined,
      fetchMostRecent: false,
    };
    expect(toDataStream(input)).toEqual({
      id: input.streamId,
      data: input.dataPoints,
      resolution: 0,
      meta,
      isRefreshing: false,
    });
  });

  it('should return expected data stream as not isRefreshing when fetchMostRecent is true', () => {
    const meta = {
      entityId: 'entity',
      componentName: 'comp',
      propertyName: 'prop',
    };
    const input = {
      streamId: 'test-stream',
      dataPoints: [{ x: 123456, y: 'value' }],
      ...meta,
      nextToken: 'abc',
      fetchMostRecent: true,
    };
    expect(toDataStream(input)).toEqual({
      id: input.streamId,
      data: input.dataPoints,
      resolution: 0,
      meta,
      isRefreshing: false,
    });
  });
});

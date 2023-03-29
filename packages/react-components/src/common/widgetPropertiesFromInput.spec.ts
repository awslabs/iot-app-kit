import { DATA_TYPE } from '@iot-app-kit/core';
import { widgetPropertiesFromInputs } from './widgetPropertiesFromInputs';
import { StreamType } from './constants';
import type { DataStream, DataPoint } from '@iot-app-kit/core';

it('returns no points when provided no data streams', () => {
  const { propertyPoint, alarmPoint } = widgetPropertiesFromInputs({
    dataStreams: [],
    viewport: { duration: '11m' },
    thresholds: [],
  });

  expect(propertyPoint).toBeUndefined();
  expect(alarmPoint).toBeUndefined();
});

describe('parsing alarm information', () => {
  it('returns alarm point when provided data stream of alarm type with a data point', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'alarm-stream',
      id: 'alarms',
      resolution: 0,
      streamType: StreamType.ALARM,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { alarmPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { duration: '11m' },
    });

    expect(alarmPoint).toBe(alarmPoint);
  });

  it('returns no alarm point when all data points fall after the viewport', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'alarm-stream',
      id: 'alarms',
      resolution: 0,
      streamType: StreamType.ALARM,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { alarmPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { start: new Date(1990, 0, 0), end: new Date(1991, 0, 0) },
    });

    expect(alarmPoint).toBeUndefined();
  });

  it('returns alarm point when datapoint is before viewport', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'alarm-stream',
      id: 'alarms',
      resolution: 0,
      streamType: StreamType.ALARM,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { alarmPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { start: new Date(2010, 0, 0), end: new Date(2020, 0, 0) },
    });

    expect(alarmPoint).toBe(dataPoint);
  });
});

describe('parsing property information', () => {
  it('returns property point when provided data stream with no specified stream type', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'property-stream',
      id: 'alarms',
      resolution: 0,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { propertyPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { duration: '12m' },
    });

    expect(propertyPoint).toBe(dataPoint);
  });

  it('returns no property point when all data points fall after the viewport', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'property-stream',
      id: 'alarms',
      resolution: 0,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { propertyPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { start: new Date(1990, 0, 0), end: new Date(1991, 0, 0) },
    });

    expect(propertyPoint).toBeUndefined();
  });

  it('returns property point when datapoint is before the viewport', () => {
    const dataPoint: DataPoint<string> = { x: new Date(2000, 0, 0).getTime(), y: 'ALARM' };
    const DATA_STREAM: DataStream<string> = {
      name: 'property-stream',
      id: 'alarms',
      resolution: 0,
      dataType: DATA_TYPE.STRING,
      data: [dataPoint],
      color: 'black',
    };
    const { propertyPoint } = widgetPropertiesFromInputs({
      dataStreams: [DATA_STREAM],
      thresholds: [],
      viewport: { start: new Date(2010, 0, 0), end: new Date(2020, 0, 0) },
    });

    expect(propertyPoint).toBe(dataPoint);
  });
});

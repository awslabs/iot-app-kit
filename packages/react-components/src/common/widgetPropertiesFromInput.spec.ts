import { DataStream } from '@iot-app-kit/core';
import { widgetPropertiesFromInputs } from './widgetPropertiesFromInputs';
import { StreamType, DataType } from './constants';
import { DataPoint } from './dataTypes';

it('returns no points when provided no data streams', () => {
  const { propertyPoint, alarmPoint } = widgetPropertiesFromInputs({ dataStreams: [] });

  expect(propertyPoint).toBeUndefined();
  expect(alarmPoint).toBeUndefined();
});

it('returns alarm point when provided data stream of alarm type with a data point', () => {
  const dataPoint: DataPoint<string> = { x: 123123, y: 'ALARM' };
  const DATA_STREAM: DataStream<string> = {
    name: 'alarm-stream',
    id: 'alarms',
    resolution: 0,
    streamType: StreamType.ALARM,
    dataType: DataType.STRING,
    data: [dataPoint],
    color: 'black',
  };
  const { propertyPoint, alarmPoint } = widgetPropertiesFromInputs({ dataStreams: [DATA_STREAM] });

  expect(propertyPoint).toBeUndefined();
  expect(alarmPoint).toBe(alarmPoint);
});

it('returns property point when provided data stream with no specified stream type', () => {
  const dataPoint: DataPoint<string> = { x: 123123, y: 'ALARM' };
  const DATA_STREAM: DataStream<string> = {
    name: 'property-stream',
    id: 'alarms',
    resolution: 0,
    dataType: DataType.STRING,
    data: [dataPoint],
    color: 'black',
  };
  const { propertyPoint, alarmPoint } = widgetPropertiesFromInputs({ dataStreams: [DATA_STREAM] });

  expect(propertyPoint).toBe(dataPoint);
  expect(alarmPoint).toBeUndefined();
});

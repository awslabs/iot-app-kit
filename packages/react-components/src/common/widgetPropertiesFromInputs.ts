import { viewportEndDate } from '@iot-app-kit/core';
import { DATA_ALIGNMENT, StreamType } from './constants';
import { breachedThreshold } from '../utils/breachedThreshold';
import { closestPoint } from '../utils/activePoints';
import type { DataStream, DataPoint, Viewport, Threshold } from '@iot-app-kit/core';

const propertyInfo = ({
  dataStreams,
  thresholds,
  viewport,
}: {
  dataStreams: DataStream[];
  thresholds: Threshold[];
  viewport: Viewport;
}) => {
  const dataStream = dataStreams.find(({ streamType }) => streamType == null);
  const points: DataPoint[] = dataStream?.data || [];
  const date = viewportEndDate(viewport);
  const point = closestPoint(points, date, DATA_ALIGNMENT.LEFT);

  const threshold =
    point &&
    dataStream &&
    breachedThreshold({
      value: point.y,
      date: new Date(point.x),
      thresholds,
      dataStream,
      dataStreams,
    });

  return {
    propertyPoint: point,
    propertyThreshold: threshold,
    propertyStream: dataStream,
  };
};

const alarmInfo = ({
  dataStreams,
  viewport,
  thresholds,
}: {
  dataStreams: DataStream[];
  thresholds: Threshold[];
  viewport: Viewport;
}) => {
  const dataStream = dataStreams.find(({ streamType }) => streamType == StreamType.ALARM);
  const points: DataPoint[] = dataStream?.data || [];
  const date = viewportEndDate(viewport);
  const point = closestPoint(points, date, DATA_ALIGNMENT.LEFT);

  const threshold =
    point &&
    dataStream &&
    breachedThreshold({
      value: point.y,
      date: new Date(point.x),
      thresholds,
      dataStream,
      dataStreams,
    });

  return {
    alarmPoint: point,
    alarmThreshold: threshold,
    alarmStream: dataStream,
  };
};

/**
 * parses time series data and returns the thresholds, data streams and data points of interest
 * in widgets that display a single data point in time (i.e. KPI, Status, Gauge, Dial, etc.)
 */
export const widgetPropertiesFromInputs = (input: {
  dataStreams: DataStream[];
  thresholds: Threshold[];
  viewport: Viewport;
}) => {
  return {
    ...alarmInfo(input),
    ...propertyInfo(input),
  };
};

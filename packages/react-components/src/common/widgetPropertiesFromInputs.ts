import { viewportEndDate } from '@iot-app-kit/core';
import { DATA_ALIGNMENT, StreamType } from './constants';
import { breachedThreshold } from '../utils/breachedThreshold';
import { closestPoint } from '../utils/activePoints';
import type { Annotations, DataStream, DataPoint, Viewport } from '@iot-app-kit/core';

const propertyInfo = ({
  dataStreams,
  annotations = {},
  viewport,
}: {
  dataStreams: DataStream[];
  annotations?: Annotations;
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
      annotations: annotations,
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
  annotations = {},
}: {
  dataStreams: DataStream[];
  annotations?: Annotations;
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
      annotations,
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
  annotations?: Annotations;
  viewport: Viewport;
}) => {
  return {
    ...alarmInfo(input),
    ...propertyInfo(input),
  };
};

import { getBreachedThreshold } from './thresholdUtils';
import { isDefined } from './predicates';
import { closestPoint } from './activePoints';
import { DATA_ALIGNMENT, StreamType } from '../common/constants';
import type { Threshold, DataStream, DataStreamId, Primitive } from '@iot-app-kit/core';

const isHigherPriority = (t1: undefined | Threshold, t2: Threshold): Threshold => {
  if (t1 == null) {
    return t2;
  }
  if (t1.severity == null && t2.severity == null) {
    return t1;
  }
  if (t1.severity == null) {
    return t2;
  }
  if (t2.severity == null) {
    return t1;
  }
  return t1.severity <= t2.severity ? t1 : t2;
};

/**
 * Returns the most important threshold.
 *
 * The most important threshold is the visual which is most important to a user
 * This is determined via the `severity`. Lower severity means highest importance.
 *
 * If no thresholds are present with `severity`, the first threshold is returned.
 */
export const highestPriorityThreshold = (thresholds: Threshold[]): Threshold | undefined => {
  return thresholds.reduce(isHigherPriority, undefined);
};

/**
 * returns whether the given threshold can be applied to the requested data stream.
 *
 * EXPOSED FOR TESTING
 */
export const thresholdAppliesToDataStream = (threshold: Threshold, dataStreamId: DataStreamId): boolean => {
  const { dataStreamIds } = threshold;
  if (dataStreamIds == null) {
    return true;
  }
  return dataStreamIds.includes(dataStreamId);
};

/**
 * Returns all of the breached thresholds for any of the alarms associated with the requested data stream.
 *
 * Does NOT return them in any sort of priority order.
 *
 * EXPOSED FOR TESTING
 */
export const breachedAlarmThresholds = ({
  date,
  dataStream,
  dataStreams,
  thresholds,
}: {
  date: Date;
  dataStream: DataStream;
  dataStreams: DataStream[];
  thresholds: Threshold[];
}): Threshold[] => {
  const alarmStreamIds: string[] =
    dataStream.associatedStreams != null
      ? dataStream.associatedStreams.filter(({ type }) => type === StreamType.ALARM).map(({ id }) => id)
      : [];

  const isAssociatedAlarm = (stream: DataStream) => alarmStreamIds.includes(stream.id);
  const alarmStreams = dataStreams.filter(isAssociatedAlarm);

  // thresholds considered breech, across all alarms for the requested data stream
  const allBreachedAlarmThresholds = alarmStreams
    .map((stream) => {
      const alarmThresholds = thresholds.filter((threshold) => thresholdAppliesToDataStream(threshold, stream.id));
      const latestAlarmValue = closestPoint(stream.data, date, DATA_ALIGNMENT.LEFT);
      return latestAlarmValue != null ? getBreachedThreshold(latestAlarmValue.y, alarmThresholds) : undefined;
    })
    .filter(isDefined);

  return allBreachedAlarmThresholds;
};

/**
 * Get the highest priority breached threshold.
 *
 * NOTE: If you do not want to get alarm thresholds, simply pass in an empty array for the `dataStreams`.
 */
export const breachedThreshold = ({
  value,
  date,
  thresholds,
  dataStreams,
  dataStream,
}: {
  // The value to evaluate whether thresholds are breached
  value: Primitive | undefined;
  // The point in time to evaluate the alarm streams at against the thresholds
  date: Date;
  thresholds: Threshold[];
  // All data streams, utilized to find the alarm streams associated with the info
  dataStreams: DataStream[];
  // stream associated with the point who's value is being evaluated. Used to find associated alarms
  dataStream: DataStream;
}): Threshold | undefined => {
  const applicableThresholds = thresholds.filter((threshold) => thresholdAppliesToDataStream(threshold, dataStream.id));
  const dataThreshold = value != null ? getBreachedThreshold(value, applicableThresholds) : undefined;

  const alarmThresholds = breachedAlarmThresholds({
    date,
    dataStream,
    dataStreams,
    thresholds,
  });

  return highestPriorityThreshold([dataThreshold, ...alarmThresholds].filter(isDefined));
};

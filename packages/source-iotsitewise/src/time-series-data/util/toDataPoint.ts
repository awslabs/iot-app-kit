import { NANO_SECOND_IN_MS, SECOND_IN_MS } from './timeConstants';
import type { DataPoint } from '@iot-app-kit/core';
import type {
  AssetPropertyValue,
  TimeInNanos,
  Aggregates,
  AggregatedValue,
} from '@aws-sdk/client-iotsitewise';
import { toValue } from '@iot-app-kit/helpers';

/** converts the TimeInNanos to milliseconds */
const toTimestamp = (time: TimeInNanos | undefined): number =>
  (time &&
    Math.floor(
      (time.timeInSeconds || 0) * SECOND_IN_MS +
        (time.offsetInNanos || 0) * NANO_SECOND_IN_MS
    )) ||
  0;

/**
 * Converts a SiteWise response for data into a data point understood by IoT App Kit.
 */
export const toDataPoint = (
  assetPropertyValue: AssetPropertyValue | undefined
): DataPoint | undefined => {
  if (assetPropertyValue == null) {
    return undefined;
  }
  const { timestamp, value, quality } = assetPropertyValue;
  const dataValue = toValue(value);

  if (dataValue == null) {
    return undefined;
  }

  return {
    x: toTimestamp(timestamp),
    y: dataValue,
    quality,
  };
};

// TODO: support outputting multiple sets of DataStream for multiple aggregate types.
const aggregateToValue = ({
  average,
  count,
  maximum,
  minimum,
  sum,
  standardDeviation,
}: Aggregates): number => {
  if (average != null) {
    return average;
  }

  if (count != null) {
    return count;
  }

  if (maximum != null) {
    return maximum;
  }

  if (minimum != null) {
    return minimum;
  }

  if (sum != null) {
    return sum;
  }

  if (standardDeviation != null) {
    return standardDeviation;
  }

  throw new Error(
    'Expected there to be a valid aggregate contained in `Aggregates`'
  );
};

/**
 * AggregatedValue currently might not return timestamp according to the typescript AggregatedValue interface
 */
const getAggregateTimestamp = (timestamp?: Date) => {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }

  throw new Error('Expected timestamp to be instance of Date');
};

/**
 * Aggregates To Data Point
 *
 * Converts an `AggregatedValue` to the data point view model
 */
export const aggregateToDataPoint = ({
  timestamp,
  value,
  quality,
}: AggregatedValue): DataPoint<number> => ({
  x: getAggregateTimestamp(timestamp),
  y: aggregateToValue(value as Aggregates),
  quality,
});

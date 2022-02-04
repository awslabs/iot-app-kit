import { AssetPropertyValue, TimeInNanos, Variant, Aggregates, AggregatedValue } from '@aws-sdk/client-iotsitewise';
import { DataPoint, Primitive } from '@synchro-charts/core';
import { NANO_SECOND_IN_MS, SECOND_IN_MS } from '../../../common/time';

/** converts the TimeInNanos to milliseconds */
const toTimestamp = (time: TimeInNanos | undefined): number =>
  (time && Math.floor((time.timeInSeconds || 0) * SECOND_IN_MS + (time.offsetInNanos || 0) * NANO_SECOND_IN_MS)) || 0;

/**
 * Extracts the value out of a SiteWise Model Variant
 *
 * SiteWise Model values can either be a string, number or boolean.
 *
 * NOTE: Currently we treat booleans as strings.
 */
export const toValue = (variant: Variant | undefined): Primitive => {
  if (variant == null) {
    throw new Error('variant is undefined');
  }

  const { doubleValue, integerValue, stringValue, booleanValue } = variant;

  if (doubleValue != null) {
    return doubleValue;
  }

  if (integerValue != null) {
    return integerValue;
  }

  if (stringValue != null) {
    return stringValue;
  }

  if (booleanValue != null) {
    return booleanValue.toString();
  }

  throw new Error('Expected value to have at least one property value, but instead it has none!');
};

/**
 * Converts a SiteWise response for data into a data point understood by IoT App Kit.
 */
export const toDataPoint = (assetPropertyValue: AssetPropertyValue | undefined): DataPoint | undefined => {
  if (assetPropertyValue == null) {
    return undefined;
  }
  const { timestamp, value } = assetPropertyValue;
  const dataValue = toValue(value);

  if (dataValue == null) {
    return undefined;
  }

  return {
    x: toTimestamp(timestamp),
    y: dataValue,
  };
};

// TODO: support outputting multiple sets of DataStream for multiple aggregate types.
const aggregateToValue = ({ average, count, maximum, minimum, sum }: Aggregates): number => {
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

  throw new Error('Expected there to be a valid aggregate contained in `Aggregates`');
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
export const aggregateToDataPoint = ({ timestamp, value }: AggregatedValue): DataPoint<number> => ({
  x: getAggregateTimestamp(timestamp),
  y: aggregateToValue(value as Aggregates),
});

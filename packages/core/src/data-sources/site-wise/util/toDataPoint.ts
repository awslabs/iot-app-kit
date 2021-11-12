import { AssetPropertyValue, TimeInNanos, Variant } from '@aws-sdk/client-iotsitewise';
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

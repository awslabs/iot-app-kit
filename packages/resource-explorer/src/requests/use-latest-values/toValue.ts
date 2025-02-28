import type { Primitive } from '@iot-app-kit/core';
import type { Variant } from '@aws-sdk/client-iotsitewise';

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

  if ('nullValue' in variant && variant.nullValue != null) {
    /**
     * nullValue is not a nullish value
     * it's an object with the string type of
     * what the value should be.
     */
    return null;
  }

  /**
   * A variant with no properties is treated
   * as null data so that datastreams do not
   * break when the sdk updates
   */
  return null;
  // throw new Error(
  //   'Expected value to have at least one property value, but instead it has none!'
  // );
};

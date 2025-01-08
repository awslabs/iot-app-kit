import type {
  DataValue,
  DataType as TMDataType,
} from '@aws-sdk/client-iottwinmaker';
import { Type } from '@aws-sdk/client-iottwinmaker';
import type { Primitive } from '@iot-app-kit/helpers';
import type { DataType } from '@iot-app-kit/core';
import { DATA_TYPE } from '@iot-app-kit/core';
import isEmpty from 'lodash-es/isEmpty';
import isNil from 'lodash-es/isNil';
import isNumber from 'lodash-es/isNumber';
import isString from 'lodash-es/isString';

/**
 * Check if value is not null and not undefined.
 *
 * @param value The value to check.
 * @returns Returns false if the value is nullish, otherwise true.
 */
export const isDefined = <T>(value: T | null | undefined): value is T =>
  !isNil(value);

/**
 * Extracts the value out of a TwinMaker property's DataValue
 *
 * NOTE: Currently we treat booleans and objects as strings.
 */
export const toValue = (dataValue: DataValue): Primitive | undefined => {
  const values = Object.values(dataValue).filter(isDefined);

  if (isEmpty(values)) {
    console.warn(
      'Expected value to have at least one property value, but instead it has none!'
    );
    return undefined;
  }

  if (values.length > 1) {
    console.warn(
      'More than one value found in DataValue, use a random value only'
    );
  }

  const value = values[0];

  if (isNumber(value) || isString(value)) {
    return value;
  }

  // Non-primitive value converts to string by default
  return JSON.stringify(value);
};

/**
 * Convert the TwinMaker DataType into AppKit DataType
 *
 * @param tmDataType the TwinMaker DataType to be converted.
 * @returns the converted AppKit DataType
 */
export const toDataType = (tmDataType: TMDataType): DataType | undefined => {
  if (!tmDataType.type) return undefined;

  switch (tmDataType.type) {
    case Type.BOOLEAN:
      return DATA_TYPE.BOOLEAN;
    case Type.DOUBLE:
    case Type.INTEGER:
    case Type.LONG:
      return DATA_TYPE.NUMBER;
    default:
      // Other types are converted to string for now.
      return DATA_TYPE.STRING;
  }
};

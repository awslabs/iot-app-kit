import { DataPoint, DataType, Primitive } from '@synchro-charts/core';
import { DataValue, PropertyValue, DataType as TMDataType, Type } from '@aws-sdk/client-iottwinmaker';
import { isEmpty, isNil, isNumber, isString } from 'lodash';
import { DataStream } from '@iot-app-kit/core';

/**
 * Check if value is not null and not undefined.
 *
 * @param value The value to check.
 * @returns Returns false if the value is nullish, otherwise true.
 */
export const isDefined = <T>(value: T | null | undefined): value is T => !isNil(value);

/**
 * Extracts the value out of a TwinMaker property's DataValue
 *
 * NOTE: Currently we treat booleans and objects as strings.
 */
export const toValue = (dataValue: DataValue): Primitive | undefined => {
  const values = Object.values(dataValue).filter(isDefined);

  if (isEmpty(values)) {
    console.warn('Expected value to have at least one property value, but instead it has none!');
    return undefined;
  }

  if (values.length > 1) {
    console.warn('More than one value found in DataValue, use a random value only');
  }

  const value = values[0];

  if (isNumber(value) || isString(value)) {
    return value;
  }

  // Non-primitive value converts to string by default
  return JSON.stringify(value);
};

/**
 * Converts a response for data into a data point understood by IoT App Kit.
 */
export const toDataPoint = (propertyValue: PropertyValue | undefined): DataPoint | undefined => {
  if (isNil(propertyValue)) {
    return undefined;
  }
  const { time, value } = propertyValue;
  if (isNil(time) || isNil(value)) {
    return undefined;
  }

  const dataValue = toValue(value);
  if (dataValue === undefined) {
    return undefined;
  }

  return {
    x: new Date(time).getTime(),
    y: dataValue,
  };
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
      return DataType.BOOLEAN;
    case Type.DOUBLE:
    case Type.INTEGER:
    case Type.LONG:
      return DataType.NUMBER;
    default:
      // Other types are converted to string for now.
      return DataType.STRING;
  }
};

export const toDataStream = ({
  streamId,
  dataPoints = [],
  entityId,
  componentName,
  propertyName,
}: {
  streamId: string;
  dataPoints: DataPoint[];
  entityId: string;
  componentName: string;
  propertyName: string;
}): DataStream => {
  const dataStream: DataStream = {
    id: streamId,
    data: dataPoints,
    resolution: 0,
    meta: {
      entityId,
      componentName,
      propertyName,
    },
  };

  return dataStream;
};

import { type PropertyDataType } from '@aws-sdk/client-iotsitewise';
import type { DataType } from '@iot-app-kit/core';

export const toDataType = (
  propertyDataType: PropertyDataType | string | undefined
): DataType => {
  return propertyDataType === 'STRING' || propertyDataType === 'BOOLEAN'
    ? propertyDataType
    : 'NUMBER';
};

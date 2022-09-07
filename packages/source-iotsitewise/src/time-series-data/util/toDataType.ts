import { PropertyDataType } from '@aws-sdk/client-iotsitewise';
import { DataType } from '@iot-app-kit/core';

export const toDataType = (propertyDataType: PropertyDataType | string | undefined): DataType => {
  if (propertyDataType === 'STRING') {
    return 'STRING';
  }
  if (propertyDataType === 'BOOLEAN') {
    return 'BOOLEAN';
  }

  return 'NUMBER';
};

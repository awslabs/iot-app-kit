import { GetAssetPropertyValueResponse } from '@aws-sdk/client-iotsitewise';

/**
 * Mocks, related to a SiteWise Assert property value
 *
 * Learn more at the documentation:
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyValue.html
 */

export const ASSET_PROPERTY_INTEGER_VALUE: GetAssetPropertyValueResponse = {
  propertyValue: {
    value: {
      integerValue: 10,
    },
    timestamp: {
      timeInSeconds: 1000,
      offsetInNanos: 44,
    },
  },
};

export const ASSET_PROPERTY_DOUBLE_VALUE: GetAssetPropertyValueResponse = {
  propertyValue: {
    value: {
      doubleValue: 10.123,
    },
    timestamp: {
      timeInSeconds: 1000,
      offsetInNanos: 99000004,
    },
  },
};

export const ASSET_PROPERTY_STRING_VALUE: GetAssetPropertyValueResponse = {
  propertyValue: {
    value: {
      stringValue: 'im a string',
    },
    timestamp: {
      timeInSeconds: 1000,
      offsetInNanos: 44,
    },
  },
};

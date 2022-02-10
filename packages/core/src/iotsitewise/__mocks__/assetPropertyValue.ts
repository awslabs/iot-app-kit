import {
  AssetPropertyValue,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueHistoryResponse,
  GetAssetPropertyValueResponse,
  Quality
} from "@aws-sdk/client-iotsitewise";

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

export const ASSET_PROPERTY_VALUE_HISTORY: GetAssetPropertyValueHistoryResponse = {
  assetPropertyValueHistory: [
    {
      value: {
        doubleValue: 10.123,
      },
      timestamp: {
        timeInSeconds: 1000,
        offsetInNanos: 99000004,
      },
    },
    {
      value: {
        doubleValue: 12.01,
      },
      timestamp: {
        timeInSeconds: 2000,
        offsetInNanos: 0,
      },
    },
  ],
};

export const AGGREGATE_VALUES: GetAssetPropertyAggregatesResponse = {
  aggregatedValues: [
    {
      timestamp: new Date(2000, 0, 0, 1),
      value: {
        average: 5,
      },
    },
    {
      timestamp: new Date(2000, 0, 0, 2),
      value: {
        average: 7,
      },
    },
    {
      timestamp: new Date(2000, 0, 0, 3),
      value: {
        average: 10,
      },
    },
  ],
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
export const samplePropertyValue: AssetPropertyValue = {
  value: { stringValue: undefined, booleanValue: undefined, doubleValue: undefined, integerValue: 1234 },
  quality: Quality.GOOD,
  timestamp: {
    timeInSeconds: 100,
    offsetInNanos: 100
  }
};

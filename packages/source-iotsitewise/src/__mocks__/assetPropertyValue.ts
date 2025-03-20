import type {
  AssetPropertyValue,
  BatchGetAssetPropertyAggregatesResponse,
  BatchGetAssetPropertyValueHistoryErrorEntry,
  BatchGetAssetPropertyValueHistoryResponse,
  BatchGetAssetPropertyValueResponse,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueHistoryResponse,
  GetAssetPropertyValueResponse,
} from '@aws-sdk/client-iotsitewise';
import { BatchGetAssetPropertyValueHistoryErrorCode, Quality } from '@aws-sdk/client-iotsitewise';

export const ASSET_PROPERTY_VALUE_HISTORY = {
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
} satisfies GetAssetPropertyValueHistoryResponse;

export const BATCH_ASSET_PROPERTY_VALUE_HISTORY = {
  successEntries: [
    {
      entryId: '0-0',
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
    },
    {
      entryId: '0-1',
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
      ],
    },
    {
      entryId: '1-0',
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
      ],
    },
    {
      entryId: '1-1',
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
      ],
    },
  ],
  errorEntries: [],
  skippedEntries: [],
} satisfies BatchGetAssetPropertyValueHistoryResponse;

export const BATCH_ASSET_PROPERTY_ERROR_ENTRY = {
  entryId: '0-0',
  errorMessage: 'assetId 1 not found',
  errorCode: BatchGetAssetPropertyValueHistoryErrorCode.ResourceNotFoundException,
} satisfies BatchGetAssetPropertyValueHistoryErrorEntry;

export const BATCH_ASSET_PROPERTY_ERROR = {
  successEntries: [],
  errorEntries: [BATCH_ASSET_PROPERTY_ERROR_ENTRY],
  skippedEntries: [],
} satisfies BatchGetAssetPropertyValueHistoryResponse;

export const AGGREGATE_VALUES = {
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
} satisfies GetAssetPropertyAggregatesResponse;

export const BATCH_ASSET_PROPERTY_AGGREGATES = {
  successEntries: [
    {
      entryId: '0-0',
      ...AGGREGATE_VALUES,
    },
    {
      entryId: '0-1',
      ...AGGREGATE_VALUES,
    },
    {
      entryId: '1-0',
      ...AGGREGATE_VALUES,
    },
    {
      entryId: '1-1',
      ...AGGREGATE_VALUES,
    },
  ],
  errorEntries: [],
  skippedEntries: [],
} satisfies BatchGetAssetPropertyAggregatesResponse;

export const BATCH_ASSET_PROPERTY_DOUBLE_VALUE = {
  successEntries: [
    {
      entryId: '0-0',
      assetPropertyValue: {
        value: {
          doubleValue: 10.123,
        },
        timestamp: {
          timeInSeconds: 1000,
          offsetInNanos: 99000004,
        },
      },
    },
    {
      entryId: '0-1',
      assetPropertyValue: {
        value: {
          doubleValue: 10.123,
        },
        timestamp: {
          timeInSeconds: 1000,
          offsetInNanos: 99000004,
        },
      },
    },
  ],
  errorEntries: [],
  skippedEntries: [],
} satisfies BatchGetAssetPropertyValueResponse;

export const ASSET_PROPERTY_DOUBLE_VALUE = {
  propertyValue: {
    value: {
      doubleValue: 10.123,
    },
    timestamp: {
      timeInSeconds: 1000,
      offsetInNanos: 99000004,
    },
  },
} satisfies GetAssetPropertyValueResponse;

export const ASSET_PROPERTY_STRING_VALUE = {
  propertyValue: {
    value: {
      stringValue: 'im a string',
    },
    timestamp: {
      timeInSeconds: 1000,
      offsetInNanos: 44,
    },
  },
} satisfies GetAssetPropertyValueResponse;

export const samplePropertyValue = {
  value: { stringValue: undefined, booleanValue: undefined, doubleValue: undefined, integerValue: 1234 },
  quality: Quality.GOOD,
  timestamp: {
    timeInSeconds: 100,
    offsetInNanos: 100,
  },
} satisfies AssetPropertyValue;

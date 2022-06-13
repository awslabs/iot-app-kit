import {
  AssetPropertyValue,
  AggregatedValue,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueHistoryResponse,
  GetAssetPropertyValueResponse,
  BatchGetAssetPropertyValueHistoryResponse,
  BatchGetAssetPropertyAggregatesResponse,
  BatchGetAssetPropertyValueResponse,
} from '@aws-sdk/client-iotsitewise';
import { RAW_DATA, MINUTE_AGGREGATED_DATA, HOUR_AGGREGATED_DATA, DAY_AGGREGATED_DATA } from './data';
import { MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS, SECOND_IN_MS } from '@iot-app-kit/core/src/common/time';

const MINUTE_IN_S = MINUTE_IN_MS / SECOND_IN_MS;
const HOUR_IN_S = HOUR_IN_MS / SECOND_IN_MS;
const DAY_IN_S = DAY_IN_MS / SECOND_IN_MS;

export const mockLatestValueResponse = (): { body: GetAssetPropertyValueResponse } => {
  return {
    body: {
      propertyValue: RAW_DATA[RAW_DATA.length - 1],
    },
  };
};

export const mockBatchLatestValueResponse = (): { body: BatchGetAssetPropertyValueResponse } => {
  return {
    body: {
      successEntries: [
        {
          entryId: '0-0',
          assetPropertyValue: RAW_DATA[RAW_DATA.length - 1],
        },
      ],
      errorEntries: [],
      skippedEntries: [],
    },
  };
};

/**
 * Returns exactly what the parsed JSON response from the SDK returns.
 *
 * There's slight deviations from the specified types:
 * 1. The timestamps are converted from number to date for the times that don't have a nanosecond component, so we must 'cast' them to allow the types to pass
 * 2. The `undefined` is turned into a null, so we must cast those.
 */
export const mockGetAggregatedOrRawResponse = ({
  startDate,
  endDate,
  resolution,
}: {
  startDate: Date;
  endDate: Date;
  resolution?: string;
}): { body: GetAssetPropertyValueHistoryResponse | GetAssetPropertyAggregatesResponse } => {
  const startTimestampInSeconds = Math.round(startDate.getTime()) / 1000;
  const endTimestampInSeconds = Math.round(endDate.getTime()) / 1000;

  if (resolution === '1m') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += MINUTE_IN_S) {
      data.push({
        ...MINUTE_AGGREGATED_DATA[timestamp % MINUTE_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else if (resolution === '1h') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += HOUR_IN_S) {
      data.push({
        ...HOUR_AGGREGATED_DATA[timestamp % HOUR_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else if (resolution === '1d') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += DAY_IN_S) {
      data.push({
        ...DAY_AGGREGATED_DATA[timestamp % DAY_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else {
    const data: AssetPropertyValue[] = [];
    for (let timeInSeconds = startTimestampInSeconds; timeInSeconds <= endTimestampInSeconds; timeInSeconds++) {
      data.push({
        ...RAW_DATA[timeInSeconds % RAW_DATA.length],
        timestamp: { offsetInNanos: 0, timeInSeconds },
      });
    }

    return {
      body: {
        assetPropertyValueHistory: data,
      },
    };
  }
};

/**
 * Returns exactly what the parsed JSON response from the SDK returns for batch calls
 *
 * There's slight deviations from the specified types:
 * 1. The timestamps are converted from number to date for the times that don't have a nanosecond component, so we must 'cast' them to allow the types to pass
 * 2. The `undefined` is turned into a null, so we must cast those.
 */
export const mockBatchGetAggregatedOrRawResponse = ({
  startDate,
  endDate,
  resolution,
  entryId = '0-0',
}: {
  startDate: Date;
  endDate: Date;
  resolution?: string;
  entryId?: string;
}): { body: BatchGetAssetPropertyValueHistoryResponse | BatchGetAssetPropertyAggregatesResponse } => {
  const startTimestampInSeconds = Math.round(startDate.getTime()) / 1000;
  const endTimestampInSeconds = Math.round(endDate.getTime()) / 1000;

  if (resolution === '1m') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += MINUTE_IN_S) {
      data.push({
        ...MINUTE_AGGREGATED_DATA[timestamp % MINUTE_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        successEntries: [
          {
            entryId,
            aggregatedValues: data,
          },
        ],
        errorEntries: [],
        skippedEntries: [],
      },
    };
  } else if (resolution === '1h') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += HOUR_IN_S) {
      data.push({
        ...HOUR_AGGREGATED_DATA[timestamp % HOUR_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        successEntries: [
          {
            entryId,
            aggregatedValues: data,
          },
        ],
        errorEntries: [],
        skippedEntries: [],
      },
    };
  } else if (resolution === '1d') {
    const data: AggregatedValue[] = [];
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += DAY_IN_S) {
      data.push({
        ...DAY_AGGREGATED_DATA[timestamp % DAY_AGGREGATED_DATA.length],
        timestamp: timestamp as unknown as Date,
      });
    }

    return {
      body: {
        successEntries: [
          {
            entryId,
            aggregatedValues: data,
          },
        ],
        errorEntries: [],
        skippedEntries: [],
      },
    };
  } else {
    const data: AssetPropertyValue[] = [];
    for (let timeInSeconds = startTimestampInSeconds; timeInSeconds <= endTimestampInSeconds; timeInSeconds++) {
      data.push({
        ...RAW_DATA[timeInSeconds % RAW_DATA.length],
        timestamp: { offsetInNanos: 0, timeInSeconds },
      });
    }
    return {
      body: {
        successEntries: [
          {
            entryId,
            assetPropertyValueHistory: data,
          },
        ],
        errorEntries: [],
        skippedEntries: [],
      },
    };
  }
};

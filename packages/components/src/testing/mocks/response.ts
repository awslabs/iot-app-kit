import { RAW_DATA, MINUTE_AGGREGATED_DATA, HOUR_AGGREGATED_DATA, DAY_AGGREGATED_DATA } from './data';
import { SupportedResolutions } from '@iot-app-kit/core/src/data-sources/site-wise/util/resolution';
import { MINUTE_IN_MS, HOUR_IN_MS, DAY_IN_MS } from '@iot-app-kit/core/src/common/time';

const MINUTE_IN_S = MINUTE_IN_MS / 1000;
const HOUR_IN_S = HOUR_IN_MS / 1000;
const DAY_IN_S = DAY_IN_MS / 1000;

export const mockDataResponse = (startDate: Date, endDate: Date, resolution?: string) => {
  const startTimestampInSeconds = Math.round(startDate.getTime()) / 1000;
  const endTimestampInSeconds = Math.round(endDate.getTime()) / 1000;

  const data = [];

  if (resolution === SupportedResolutions.ONE_MINUTE) {
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += MINUTE_IN_S) {
      data.push({
        ...MINUTE_AGGREGATED_DATA[timestamp % MINUTE_AGGREGATED_DATA.length],
        timestamp,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else if (resolution === SupportedResolutions.ONE_HOUR) {
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += HOUR_IN_S) {
      data.push({
        ...HOUR_AGGREGATED_DATA[timestamp % HOUR_AGGREGATED_DATA.length],
        timestamp,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else if (resolution === SupportedResolutions.ONE_DAY) {
    for (let timestamp = startTimestampInSeconds; timestamp <= endTimestampInSeconds; timestamp += DAY_IN_S) {
      data.push({
        ...DAY_AGGREGATED_DATA[timestamp % DAY_AGGREGATED_DATA.length],
        timestamp,
      });
    }

    return {
      body: {
        aggregatedValues: data,
      },
    };
  } else {
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

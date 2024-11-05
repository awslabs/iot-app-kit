import { DATA_TYPE } from '@iot-app-kit/core';
import { Quality } from '@aws-sdk/client-iotsitewise';
import parse from 'parse-duration';
import {
  mockTimeSeriesDataQueryLiveStream,
  mockTimeSeriesDataQueryLiveStreamAggregated,
} from './mockTimeSeriesDataRealTime';

export const mockSinWaveData = (frequency?: string) =>
  mockTimeSeriesDataQueryLiveStream({
    refreshRate: frequency ? parse(frequency) : 250,
    dataType: DATA_TYPE.NUMBER,
    requests: [
      {
        name: 'Windmill',
        createDataPoint: (date: Date) => ({
          x: date.getTime(),
          y: 100 * Math.sin(date.getTime() / 1000),
        }),
      },
    ],
  });

export const mockSinWaveDataWithQuality = ({
  frequency,
  quality,
  positiveOnly = false,
}: {
  frequency?: string;
  quality?: Quality;
  positiveOnly?: boolean;
}) =>
  mockTimeSeriesDataQueryLiveStream({
    refreshRate: frequency ? parse(frequency) : 250,
    dataType: DATA_TYPE.NUMBER,
    requests: [
      {
        name: 'Windmill',
        createDataPoint: (date: Date) => ({
          x: date.getTime(),
          y: positiveOnly
            ? Math.abs(100 * Math.sin(date.getTime() / 1000))
            : 100 * Math.sin(date.getTime() / 1000),
          quality,
        }),
      },
    ],
  });

export const mockSinWaveDataAggregated = () =>
  mockTimeSeriesDataQueryLiveStreamAggregated({
    refreshRate: 5000,
    resolution: 1000,
    dataType: DATA_TYPE.NUMBER,
    requests: [
      {
        name: 'Windmill',
        createDataPoint: (date: Date) => ({
          x: date.getTime(),
          y: 100 * Math.sin(date.getTime() / 1000),
        }),
      },
    ],
  });

export const mockSinWaveDataValue = (date: Date) =>
  100 * Math.sin((0.5 * date.getTime()) / 1000);

const getSomeString = () => {
  const randomNum = Math.random();
  if (randomNum < 0.8) {
    return 'OK';
  }
  if (randomNum < 0.9) {
    return 'WARNING';
  }
  return 'ERROR';
};

export const mockTimeSeriesStringLiveStream = () =>
  mockTimeSeriesDataQueryLiveStream({
    refreshRate: 2000,
    dataType: DATA_TYPE.STRING,
    requests: [
      {
        name: 'Windmill',
        createDataPoint: (date: Date) => ({
          x: date.getTime(),
          y: getSomeString(),
        }),
      },
    ],
  });

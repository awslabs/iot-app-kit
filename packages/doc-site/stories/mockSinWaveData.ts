import {
  mockTimeSeriesDataQueryLiveStream,
  mockTimeSeriesDataQueryLiveStreamAggregated,
} from '@iot-app-kit/testing-util';
import { DATA_TYPE } from '@iot-app-kit/core';

export const mockSinWaveData = (frequency?: string) =>
  mockTimeSeriesDataQueryLiveStream({
    frequency: frequency || '0.25s',
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

export const mockSinWaveDataAggregated = () =>
  mockTimeSeriesDataQueryLiveStreamAggregated({
    frequency: '5s',
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
    frequency: '2s',
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

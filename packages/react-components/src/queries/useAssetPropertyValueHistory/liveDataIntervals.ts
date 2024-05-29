import { isDurationViewport, parseDuration } from '@iot-app-kit/core';
import { GetAssetPropertyValueHistoryDataRequest } from './types';

export type LiveDataInterval = {
  startOffset: number;
  duration: number;
  refreshRate?: number;
};

export const asComparable = (liveDataInterval?: LiveDataInterval) => {
  return (
    Date.now() -
    (liveDataInterval?.startOffset ?? 0) -
    (liveDataInterval?.duration ?? 0)
  );
};

export const DEFAULT_LATE_DATA_INTERVALS: LiveDataInterval[] = [
  {
    startOffset: 0,
    duration: parseDuration('72s'),
    refreshRate: parseDuration('5s'),
  },
  {
    startOffset: parseDuration('72s'),
    duration: parseDuration('3m') - parseDuration('72s'),
    refreshRate: parseDuration('30s'),
  },
  {
    startOffset: parseDuration('3m'),
    duration: parseDuration('20m') - parseDuration('3m'),
    refreshRate: parseDuration('5m'),
  },
];

export const intervalAsRequestQuery = (
  request: GetAssetPropertyValueHistoryDataRequest,
  liveDataInterval: LiveDataInterval
) => ({
  ...request,
  viewport: isDurationViewport(request.viewport)
    ? {
        startOffset: liveDataInterval.startOffset,
        duration: liveDataInterval.duration,
        refreshRate: liveDataInterval.refreshRate,
      }
    : {
        end: new Date(Date.now() - liveDataInterval.startOffset),
        start: new Date(
          Date.now() - liveDataInterval.startOffset - liveDataInterval.duration
        ),
        refreshRate: liveDataInterval.refreshRate,
      },
});

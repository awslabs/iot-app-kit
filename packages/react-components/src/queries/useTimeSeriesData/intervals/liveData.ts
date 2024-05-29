import { parseDuration } from '@iot-app-kit/core';
import { LiveDataConfiguration, Viewport } from '../types';

/**
 * Since each of these interval requests run on their own promise
 * and have to resolve NOW timestamp at execution time
 * in order to convert a live viewport into a duration one,
 * this buffer makes it more likely that we won't miss
 * a few MS worth of data between each request.
 *
 * Maybe a better way to ensure this edge case
 * won't happen?
 */
const LIVE_DATA_BUFFER_MS = 3000;

export const convertToLiveDataIntervals = (
  liveDataPeriods: LiveDataConfiguration[]
) => {
  return liveDataPeriods
    .sort((a, b) => a.duration - b.duration)
    .reduce(
      (acc, { refreshRate, duration }) => {
        const { intervals, offset } = acc;

        const viewport: Viewport = {
          refreshRate,
          duration: duration - offset + LIVE_DATA_BUFFER_MS,
          startOffset: Math.max(offset - LIVE_DATA_BUFFER_MS, 0),
        };

        return {
          intervals: [...intervals, viewport],
          offset: duration,
        };
      },
      { intervals: [], offset: 0 } as { intervals: Viewport[]; offset: number }
    ).intervals;
};

export const DEFAULT_LIVE_DATA_CONFIGURATION: LiveDataConfiguration[] = [
  {
    duration: parseDuration('72s'),
    refreshRate: parseDuration('5s'),
  },
  {
    duration: parseDuration('3m'),
    refreshRate: parseDuration('30s'),
  },
  {
    duration: parseDuration('20m'),
    refreshRate: parseDuration('5m'),
  },
];

/**
 * convert live data periods into intervals with no overlap.
 * These will be used as request viewports where overlap
 * would cause us to request ranges more than once.
 */
export const LIVE_DATA_INTERVALS = convertToLiveDataIntervals(
  DEFAULT_LIVE_DATA_CONFIGURATION
);

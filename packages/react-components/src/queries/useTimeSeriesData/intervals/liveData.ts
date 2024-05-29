import { parseDuration } from '@iot-app-kit/core';
import { LiveDataConfiguration, Viewport } from '../types';

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
          duration: duration - offset,
          startOffset: offset,
        };

        return {
          intervals: [...intervals, viewport],
          offset: duration,
        };
      },
      { intervals: [], offset: 0 } as { intervals: Viewport[]; offset: number }
    ).intervals;
};

const DEFAULT_LIVE_DATA_CONFIGURATION: LiveDataConfiguration[] = [
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

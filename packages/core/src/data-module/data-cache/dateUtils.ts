import { Interval } from '../../common/intervalStructure';
import { isHistoricalViewport } from '../../common/predicates';
import { parseDuration } from '../../common/time';
import type { DateInterval, Viewport } from './requestTypes';

/**
 * Collect the errors across the relevant data stream infos
 */

export const getDateInterval = (viewport: Viewport): DateInterval => {
  const start = isHistoricalViewport(viewport)
    ? new Date(viewport.start)
    : new Date(Date.now() - parseDuration(viewport.duration));
  const end = isHistoricalViewport(viewport)
    ? new Date(viewport.end)
    : new Date();
  return {
    start,
    end,
  };
};

export const hasIntervalForRange = (
  intervals: Interval[],
  range: { start: Date; end: Date }
) => {
  if (!intervals) return false;

  return intervals?.some((interval) => {
    const intervalStart = new Date(interval[0]);
    const intervalEnd = new Date(interval[1]);

    const isStartWithinInterval =
      range.start >= intervalStart && range.start <= intervalEnd;
    const isEndWithinInterval =
      range.end >= intervalStart && range.end <= intervalEnd;

    return isStartWithinInterval && isEndWithinInterval;
  });
};

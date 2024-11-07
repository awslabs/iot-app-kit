import { type Interval } from '../../types';

/**
 *
 * Remove a range from another range
 *
 * Returns a list of intervals that exist in the minuend
 * but not in the subtrahend.
 *
 */
export const subtractIntervals = (minuend: Interval, subtrahend: Interval) => {
  return [
    // all minuend until the min of available
    {
      ...minuend,
      start: minuend.start.getTime(),
      end: Math.min(minuend.end.getTime(), subtrahend.start.getTime()),
    },
    // all minuend after the max of subtrahend
    {
      ...minuend,
      start: Math.max(minuend.start.getTime(), subtrahend.end.getTime()),
      end: minuend.end.getTime(),
    },
  ]
    .filter((result) => result.end > result.start)
    .map((result) => ({
      start: new Date(result.start),
      end: new Date(result.end),
    }));
};

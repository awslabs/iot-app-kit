import { isBefore } from 'date-fns';
import { sortIntervals } from './sort';
import { Interval } from '../../types';

/**
 *
 * Fill in any missing interval gaps between a list of intervals
 *
 * @param intervals
 * @returns
 */
export const complete = (intervals: Interval[]) => {
  if (intervals.length === 0) return intervals;

  const sortedIntervals = sortIntervals(intervals);

  const missingIntervals: Interval[] = [];

  // fill in holes
  for (let i = 1; i < sortedIntervals.length; i++) {
    const previous = sortedIntervals[i - 1];
    const current = sortedIntervals[i];

    const { end } = previous;
    const { start } = current;

    if (isBefore(end, start)) {
      missingIntervals.push({
        start: end,
        end: start,
      });
    }
  }

  return sortIntervals([...sortedIntervals, ...missingIntervals]);
};

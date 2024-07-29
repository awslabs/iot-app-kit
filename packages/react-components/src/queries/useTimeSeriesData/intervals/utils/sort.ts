import { Interval } from '../../types';

/**
 * Sorts intervals by start time
 *
 * @param intervals to sort
 * @returns
 */
export const sortIntervals = (intervals: Interval[]) => {
  return intervals.sort((a, b) => {
    return a.start.getTime() - b.start.getTime();
  });
};

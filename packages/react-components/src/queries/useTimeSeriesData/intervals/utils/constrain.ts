import { isAfter, isBefore } from 'date-fns';
import { Interval } from '../../types';
import { sortIntervals } from './sort';

/**
 *
 * Fills in a missing leading and/or trailing edge of an interval list
 * to fit a target interval
 *
 * @param interval target interval
 * @param intervals list of intervals to constrain
 * @returns
 */
export const constrain = (interval: Interval, intervals: Interval[]) => {
  if (intervals.length === 0) return [interval];

  const sortedIntervals = sortIntervals(intervals);

  const { start, end } = interval;

  const { start: firstIntervalStart } = sortedIntervals[0];
  const { end: lastIntervalEnd } = sortedIntervals[sortedIntervals.length - 1];

  const constrainedIntervals: Interval[] = [];

  if (isBefore(start, firstIntervalStart)) {
    constrainedIntervals.push({
      start,
      end: firstIntervalStart,
    });
  }

  constrainedIntervals.push(...sortedIntervals);

  if (isAfter(end, lastIntervalEnd)) {
    constrainedIntervals.push({
      start: lastIntervalEnd,
      end: end,
    });
  }

  return constrainedIntervals;
};

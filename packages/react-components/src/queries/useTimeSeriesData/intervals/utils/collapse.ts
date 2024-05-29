import { isBefore } from 'date-fns';
import { sortIntervals } from './sort';
import { Interval } from '../../types';

/**
 *
 * merge all overlapping intervals together
 *
 * @param intervals to merge
 * @returns merged intervals
 */
export const collapse = (intervals: Interval[]) => {
  if (intervals.length === 0) return intervals;

  const sortedIntervals = sortIntervals(intervals);

  const collapsed: Interval[] = [];

  collapsed.push(sortedIntervals[0]);

  for (let i = 1; i < sortedIntervals.length; i++) {
    // get interval from stack top
    const top = collapsed[collapsed.length - 1];
    const current = sortedIntervals[i];

    const { end: topEndDate, group: topGroup } = top;

    const {
      start: currentStartDate,
      end: currentEndDate,
      group: currentGroup,
    } = current;

    /**
     * if the current interval does not overlap with the
     * top interval, add it to the stack
     */
    if (isBefore(topEndDate, currentStartDate) || topGroup !== currentGroup) {
      collapsed.push(current);
    } else if (isBefore(topEndDate, currentEndDate)) {
      collapsed.pop();
      collapsed.push({
        start: top.start,
        end: currentEndDate,
      });
    }
  }

  return collapsed;
};

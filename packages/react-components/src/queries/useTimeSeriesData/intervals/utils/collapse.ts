import { isBefore } from 'date-fns';
import { sortIntervals } from './sort';
import { Interval } from '../../types';
import isEqual from 'lodash.isequal';

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

    const topEndDates = new Date(
      Number((topEndDate.getTime() / 1000).toFixed(0)) * 1000
    );
    const currentStartDates = new Date(
      Number((currentStartDate.getTime() / 1000).toFixed(0)) * 1000
    );

    /**
     * if the current interval does not overlap with the
     * top interval, add it to the stack
     */
    if (
      !isEqual(topGroup, currentGroup) ||
      isBefore(topEndDates, currentStartDates)
    ) {
      collapsed.push(current);
    } else if (isBefore(topEndDate, currentEndDate)) {
      collapsed.pop();
      collapsed.push({
        ...current,
        start: top.start,
        end: currentEndDate,
      });
    }
  }

  return collapsed;
};

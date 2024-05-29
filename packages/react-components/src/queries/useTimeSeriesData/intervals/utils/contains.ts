import { isWithinInterval } from 'date-fns';
import { Interval } from '../../types';
import { collapse } from './collapse';

/**
 *
 * Checks that an interval list fully covers a target
 *
 * @param intervals intervals to check
 * @param interval  target interval
 */
export const contains = (intervals: Interval[], target: Interval) => {
  const intervalsWithoutGrouping = intervals.map(
    ({ group: _group, ...intervalDates }) => ({ ...intervalDates })
  );
  const collapsedIntervals = collapse(intervalsWithoutGrouping);

  /**
   * intervals should completely cover the target interval
   * without any gaps. No gaps means they are all
   * collapsible into 1 interval
   *
   * group is ignored here for simplicity
   */
  if (collapsedIntervals.length !== 1) return false;

  const [interval] = collapsedIntervals;

  return (
    isWithinInterval(target.start, interval) &&
    isWithinInterval(target.end, interval)
  );
};

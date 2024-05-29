import { Interval, areIntervalsOverlapping } from 'date-fns';

/**
 * do the 2 given intervals overlap
 *
 * @param target
 * @returns
 */
export const overlaps = (target: Interval) => (interval: Interval) =>
  areIntervalsOverlapping(target, interval, { inclusive: true });

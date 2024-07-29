import { Interval } from 'date-fns';
import { areIntervalsOverlapping } from 'date-fns/areIntervalsOverlapping';

/**
 * do the 2 given intervals overlap
 *
 * @param target
 * @returns
 */
export const overlaps = (target: Interval) => (interval: Interval) =>
  areIntervalsOverlapping(target, interval, { inclusive: true });

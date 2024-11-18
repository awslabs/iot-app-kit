import { type Interval } from '../../types';
import { sortIntervals } from './sort';
import { subtractIntervals } from './subtractIntervals';

export const divideInterval = (
  interval: Interval,
  intervalsToDivideBy: Interval[]
) => {
  const sortedIntervalsToDivideBy = sortIntervals(intervalsToDivideBy);

  const dividedIntervals = [interval];
  for (let i = 0; i < sortedIntervalsToDivideBy.length; i++) {
    const existing = sortedIntervalsToDivideBy[i];
    for (let j = 0; j < dividedIntervals.length; j++) {
      const missing = dividedIntervals[j];
      const updatedMissing = subtractIntervals(missing, existing);
      dividedIntervals.splice(j, 1, ...updatedMissing);
    }
  }

  return sortIntervals(dividedIntervals);
};

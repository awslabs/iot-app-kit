import { Interval } from '../../types';

export const removeExpiredIntervals = (intervals: Interval[], now: Date) => {
  return intervals.filter((oldInterval) =>
    oldInterval.group
      ? oldInterval.end.getTime() + oldInterval.group >= now.getTime()
      : true
  );
};

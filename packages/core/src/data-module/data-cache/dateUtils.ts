import { type Interval } from '../../common/intervalStructure';

export const hasIntervalForRange = (
  intervals: Interval[],
  range: { start: Date; end: Date }
) => {
  if (!intervals) return false;

  return intervals?.some((interval) => {
    const intervalStart = new Date(interval[0]);
    const intervalEnd = new Date(interval[1]);

    const isStartWithinInterval =
      range.start >= intervalStart && range.start <= intervalEnd;
    const isEndWithinInterval =
      range.end >= intervalStart && range.end <= intervalEnd;

    return isStartWithinInterval && isEndWithinInterval;
  });
};

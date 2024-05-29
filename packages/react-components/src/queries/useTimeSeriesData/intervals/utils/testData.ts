import { sub, add, Duration } from 'date-fns';
import { Interval } from '../../types';

export const ANCHOR_DATE = new Date(1720488638812);

/**
 * All dates are anchored to the same point and can be converted via the slide duration
 */
export const fiveMinuteInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { minutes: 5 }),
};

export const tenMinuteInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { minutes: 10 }),
};

export const oneHourInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { hours: 1 }),
};

export const tenHourInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { hours: 10 }),
};

export const oneDayInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { days: 1 }),
};

export const tenDaysInterval: Interval = {
  end: ANCHOR_DATE,
  start: sub(ANCHOR_DATE, { days: 10 }),
};

export const slideInterval = (
  interval: Interval,
  duration: Duration
): Interval => {
  return {
    ...interval,
    end: add(interval.end, duration),
    start: add(interval.start, duration),
  };
};

export const shuffleIntervals = (intervals: Interval[]): Interval[] => {
  return intervals
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

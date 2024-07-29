import { contains } from './contains';
import {
  fiveMinuteInterval,
  oneDayInterval,
  oneHourInterval,
  shuffleIntervals,
  slideInterval,
  tenDaysInterval,
  tenHourInterval,
  tenMinuteInterval,
} from './testData';

describe('contains intervals', () => {
  it('handles an empty interval list', () => {
    expect(contains([], fiveMinuteInterval)).toEqual(false);
  });

  it('handles a single item interval list', () => {
    expect(contains([fiveMinuteInterval], fiveMinuteInterval)).toEqual(true);
  });

  it('handles unsorted interval lists', () => {
    const shuffledIntervals = shuffleIntervals([
      fiveMinuteInterval,
      tenMinuteInterval,
      oneHourInterval,
      tenHourInterval,
      oneDayInterval,
      tenDaysInterval,
    ]);

    expect(contains(shuffledIntervals, fiveMinuteInterval)).toEqual(true);
  });

  it('is false if the target end is not covered', () => {
    const intervals = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
    ];

    expect(
      contains(intervals, slideInterval(fiveMinuteInterval, { minutes: 2 }))
    ).toEqual(false);
  });

  it('is false if the target start is not covered', () => {
    const intervals = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
    ];

    expect(
      contains(intervals, slideInterval(fiveMinuteInterval, { minutes: -22 }))
    ).toEqual(false);
  });

  it('is false if the list has gaps', () => {
    const intervals = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -7 }),
    ] as const;

    expect(
      contains([...intervals], {
        start: intervals[1].start,
        end: intervals[0].end,
      })
    ).toEqual(false);
  });

  it('is true if the target is covered at the ends', () => {
    const intervals = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
    ] as const;

    expect(
      contains([...intervals], {
        start: intervals[4].start,
        end: intervals[0].end,
      })
    ).toEqual(true);
  });

  it('is true if the target is within the bounds of the list', () => {
    const intervals = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
    ] as const;

    expect(
      contains([...intervals], {
        start: intervals[1].start,
        end: intervals[3].end,
      })
    ).toEqual(true);
  });
});

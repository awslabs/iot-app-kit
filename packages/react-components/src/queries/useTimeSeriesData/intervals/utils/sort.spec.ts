import { sortIntervals } from './sort';
import {
  fiveMinuteInterval,
  shuffleIntervals,
  slideInterval,
} from './testData';

describe('sort intervals', () => {
  it('handles an empty interval list', () => {
    expect(sortIntervals([])).toEqual([]);
  });

  it('handles an already sorted list', () => {
    const sorted = [
      slideInterval(fiveMinuteInterval, { minutes: -25 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ];
    expect(sortIntervals(sorted)).toEqual(sorted);
  });

  it('handles an unsorted list', () => {
    const sorted = [
      slideInterval(fiveMinuteInterval, { minutes: -25 }),
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ];

    const unsorted = [
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -25 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
    ];

    expect(sortIntervals(unsorted)).toEqual(sorted);
    expect(sortIntervals(shuffleIntervals(sorted))).toEqual(sorted);
  });
});

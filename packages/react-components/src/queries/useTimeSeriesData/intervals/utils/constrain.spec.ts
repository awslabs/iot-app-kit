import { constrain } from './constrain';
import {
  fiveMinuteInterval,
  shuffleIntervals,
  slideInterval,
  tenDaysInterval,
  tenMinuteInterval,
} from './testData';

describe('constrain intervals', () => {
  it('handles an empty interval list', () => {
    expect(constrain(fiveMinuteInterval, [])).toEqual([fiveMinuteInterval]);
  });

  it('fills in the start of an interval list', () => {
    const target = tenDaysInterval;
    const intervals = [
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    expect(constrain(target, [...intervals])).toEqual([
      {
        start: target.start,
        end: intervals[0].start,
      },
      ...intervals,
    ]);
  });

  it('fills in the end of an interval list', () => {
    const intervals = [
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    const target = {
      start: intervals[0].start,
      end: slideInterval(fiveMinuteInterval, { minutes: 5 }).end,
    };

    expect(constrain(target, [...intervals])).toEqual([
      ...intervals,
      {
        start: intervals[2].end,
        end: target.end,
      },
    ]);
  });

  it('handles unsorted intervals', () => {
    const intervals = [
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    const target = {
      start: intervals[0].start,
      end: slideInterval(fiveMinuteInterval, { minutes: 5 }).end,
    };

    expect(constrain(target, shuffleIntervals([...intervals]))).toEqual([
      ...intervals,
      {
        start: intervals[2].end,
        end: target.end,
      },
    ]);
  });

  it('does nothing if the target is covered', () => {
    const target = slideInterval(tenMinuteInterval, { minutes: -5 });
    const intervals = [
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    expect(constrain(target, shuffleIntervals([...intervals]))).toEqual(
      intervals
    );
  });
});

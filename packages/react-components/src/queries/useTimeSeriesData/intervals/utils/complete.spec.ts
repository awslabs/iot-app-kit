import { complete } from './complete';
import {
  fiveMinuteInterval,
  shuffleIntervals,
  slideInterval,
} from './testData';

describe('complete intervals', () => {
  it('handles an empty interval list', () => {
    expect(complete([])).toEqual([]);
  });

  it('handles a single interval in the list', () => {
    expect(complete([fiveMinuteInterval])).toEqual([fiveMinuteInterval]);
  });

  it('fills in missing interval gaps', () => {
    const completedList = [
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    const listWithGaps = [completedList[0], completedList[2], completedList[4]];

    expect(complete(listWithGaps)).toEqual(completedList);
  });

  it('handles overlapping and unsorted intervals', () => {
    const listWithGaps = [
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -18 }),
      slideInterval(fiveMinuteInterval, { minutes: -2 }),
      fiveMinuteInterval,
    ] as const;

    const shuffledListWithGaps = shuffleIntervals([
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -18 }),
      slideInterval(fiveMinuteInterval, { minutes: -2 }),
      fiveMinuteInterval,
    ]);

    const completedIntervals = [
      listWithGaps[0],
      listWithGaps[1],
      {
        start: listWithGaps[1].end,
        end: listWithGaps[2].start,
      },
      listWithGaps[2],
      listWithGaps[3],
    ];

    expect(complete(shuffledListWithGaps)).toEqual(completedIntervals);
  });

  it('handles shuffled intervals', () => {
    const completedList = [
      slideInterval(fiveMinuteInterval, { minutes: -20 }),
      slideInterval(fiveMinuteInterval, { minutes: -15 }),
      slideInterval(fiveMinuteInterval, { minutes: -10 }),
      slideInterval(fiveMinuteInterval, { minutes: -5 }),
      fiveMinuteInterval,
    ] as const;

    const listWithGaps = shuffleIntervals([
      completedList[0],
      completedList[2],
      completedList[4],
    ]);

    expect(complete(listWithGaps)).toEqual(completedList);
  });
});

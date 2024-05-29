import { collapse } from './collapse';
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

describe('collapse intervals', () => {
  it('handles an empty interval list', () => {
    expect(collapse([])).toEqual([]);
  });

  it('combines overlapping intervals', () => {
    expect(
      collapse([
        fiveMinuteInterval,
        tenMinuteInterval,
        oneHourInterval,
        tenHourInterval,
        oneDayInterval,
        tenDaysInterval,
      ])
    ).toEqual([
      {
        end: fiveMinuteInterval.end,
        start: tenDaysInterval.start,
      },
    ]);
  });

  it('combines overlapping intervals at the edge', () => {
    const offsetFiveMinutes = slideInterval(fiveMinuteInterval, {
      minutes: -5,
    });
    const offsetTenMinutes = slideInterval(fiveMinuteInterval, {
      minutes: -10,
    });
    expect(
      collapse([fiveMinuteInterval, offsetFiveMinutes, offsetTenMinutes])
    ).toEqual([
      {
        end: fiveMinuteInterval.end,
        start: offsetTenMinutes.start,
      },
    ]);
  });

  it('does nothing if already collapsed', () => {
    expect(collapse([fiveMinuteInterval])).toEqual([fiveMinuteInterval]);
  });

  it('does not collapse nonoverlapping intervals', () => {
    const nonoverlapping = [
      fiveMinuteInterval,
      slideInterval(fiveMinuteInterval, { minutes: 20 }),
      slideInterval(fiveMinuteInterval, { minutes: 40 }),
      slideInterval(fiveMinuteInterval, { minutes: 60 }),
    ];

    expect(collapse(nonoverlapping)).toEqual(nonoverlapping);
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

    expect(collapse(shuffledIntervals)).toEqual([
      {
        end: fiveMinuteInterval.end,
        start: tenDaysInterval.start,
      },
    ]);
  });
});

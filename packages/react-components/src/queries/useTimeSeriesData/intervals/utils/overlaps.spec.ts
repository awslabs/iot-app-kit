import { overlaps } from './overlaps';
import {
  fiveMinuteInterval,
  slideInterval,
  tenHourInterval,
  tenMinuteInterval,
} from './testData';

describe('overlaps intervals', () => {
  it('returns true if the target interval is contained within the given interval', () => {
    expect(overlaps(fiveMinuteInterval)(fiveMinuteInterval)).toEqual(true);
    expect(overlaps(fiveMinuteInterval)(tenMinuteInterval)).toEqual(true);
    expect(overlaps(fiveMinuteInterval)(tenHourInterval)).toEqual(true);
  });

  it('returns true if the target interval fully contains the given interval', () => {
    expect(overlaps(tenMinuteInterval)(fiveMinuteInterval)).toEqual(true);
    expect(overlaps(tenHourInterval)(fiveMinuteInterval)).toEqual(true);
  });

  it('returns true if the target interval partially overlaps the given interval', () => {
    expect(
      overlaps(slideInterval(fiveMinuteInterval, { minutes: -2 }))(
        fiveMinuteInterval
      )
    ).toEqual(true);
  });

  it('returns true if the target interval overlaps the given interval at the edge', () => {
    expect(
      overlaps(slideInterval(fiveMinuteInterval, { minutes: -5 }))(
        fiveMinuteInterval
      )
    ).toEqual(true);
    expect(
      overlaps(slideInterval(fiveMinuteInterval, { minutes: 5 }))(
        fiveMinuteInterval
      )
    ).toEqual(true);
  });

  it('returns false if the target interval does not overlap the given interval at the edge', () => {
    expect(
      overlaps(slideInterval(fiveMinuteInterval, { minutes: -20 }))(
        fiveMinuteInterval
      )
    ).toEqual(false);
  });
});

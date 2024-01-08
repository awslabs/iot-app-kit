import { requestRange, roundUp } from './requestRange';
import {
  DAY_IN_MS,
  HOUR_IN_MS,
  MINUTE_IN_MS,
  SECOND_IN_MS,
} from '../../common/time';

const TEST_BUFFER = 0.3;
const LARGE_MAX_DATE = new Date(9999, 0, 0);

describe.each`
  value    | roundedUp
  ${0}     | ${0}
  ${1}     | ${1}
  ${5.5}   | ${6}
  ${99}    | ${100}
  ${250}   | ${300}
  ${930}   | ${1000}
  ${999}   | ${1000}
  ${999.9} | ${1000}
  ${9950}  | ${10000}
  ${9009}  | ${10000}
  ${10000} | ${10000}
  ${10001} | ${20000}
`('rounds up correctly', ({ value, roundedUp }) => {
  test(`roundUp(${value}) => ${roundedUp}`, () => {
    expect(roundUp(value)).toBe(roundedUp);
  });
});

describe('date range to fetch data on request', () => {
  it('returns a date range that contains the input range', () => {
    const START = new Date(2000, 0, 0);
    const END = new Date(2001, 0, 0);
    const { start, end } = requestRange({
      start: START,
      end: END,
      max: LARGE_MAX_DATE,
    });
    expect(start <= START).toBe(true);
    expect(end >= END).toBe(true);
  });

  describe('returns an appropriately sized request range', () => {
    it('for a time span of 1 second, do not request more than 5 seconds', () => {
      const START = new Date(2015, 0, 5, 0, 0, 0);
      const END = new Date(2015, 0, 5, 0, 0, 1);
      const { start, end } = requestRange({
        start: START,
        end: END,
        max: LARGE_MAX_DATE,
      });
      expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(
        5 * SECOND_IN_MS
      );
    });
    it('for a time span of 30 seconds, requests at most one minute of data', () => {
      const START = new Date(2015, 0, 5, 0, 0, 15);
      const END = new Date(2015, 0, 5, 0, 0, 45);
      const { start, end } = requestRange({
        start: START,
        end: END,
        max: LARGE_MAX_DATE,
      });
      expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(MINUTE_IN_MS);
    });

    it('for a time span of 5 minutes, requests at most 10 minutes of data', () => {
      const START = new Date(2015, 0, 5, 0, 0);
      const END = new Date(2015, 0, 5, 0, 5);
      const { start, end } = requestRange({
        start: START,
        end: END,
        max: LARGE_MAX_DATE,
      });
      expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(
        10 * MINUTE_IN_MS
      );
    });

    it('for a time span of one hour, requests at most 2 hours of data', () => {
      const START = new Date(2015, 0, 5, 0);
      const END = new Date(2015, 0, 5, 1);
      const { start, end } = requestRange({
        start: START,
        end: END,
        max: LARGE_MAX_DATE,
      });
      expect(end.getTime() - start.getTime()).toBeLessThanOrEqual(
        3 * HOUR_IN_MS
      );
    });
  });

  describe('date range is identical when', () => {
    it('is panned a short distance towards the future', () => {
      const range1 = requestRange(
        {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      const range2 = requestRange(
        {
          start: new Date(2000, 0, 2),
          end: new Date(2001, 0, 2),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      expect(range1.start.toISOString()).toBe(range2.start.toISOString());
      expect(range1.end.toISOString()).toBe(range2.end.toISOString());
    });

    it('is slightly condensed time frame', () => {
      const range1 = requestRange(
        {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      const range2 = requestRange(
        {
          start: new Date(2000, 0, 10),
          end: new Date(2000, 12, 15),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      expect(range1.start.toISOString()).toBe(range2.start.toISOString());
      expect(range1.end.toISOString()).toBe(range2.end.toISOString());
    });

    it('is slightly expanded time frame', () => {
      const range1 = requestRange(
        {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      const range2 = requestRange(
        {
          start: new Date(1999, 11, 15),
          end: new Date(2001, 0, 15),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      expect(range1.start.toISOString()).toBe(range2.start.toISOString());
      expect(range1.end.toISOString()).toBe(range2.end.toISOString());
    });
  });

  describe('date range differs when', () => {
    it('pans a significant distances toward the future', () => {
      const range1 = requestRange(
        {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      const range2 = requestRange(
        {
          start: new Date(2000, 8, 0),
          end: new Date(2001, 8, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      expect(range1.start < range2.start).toBe(true);
      expect(range1.end < range2.end).toBe(true);
    });

    it('scales out to a significantly larger span of time', () => {
      const range1 = requestRange(
        {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      const range2 = requestRange(
        {
          start: new Date(1999, 0, 0),
          end: new Date(2002, 8, 0),
          max: LARGE_MAX_DATE,
        },
        TEST_BUFFER
      );
      expect(range1.start > range2.start).toBe(true);
      expect(range1.end < range2.end).toBe(true);
    });

    it('scales as expected for a large buffer percent', () => {
      const range = requestRange(
        {
          start: new Date(2018, 11, 0, 13),
          end: new Date(2018, 11, 0, 14),
          max: LARGE_MAX_DATE,
        },
        1
      );
      expect(range.end >= new Date(2018, 11, 0, 15)).toBeTrue();
      expect(range.start <= new Date(2018, 11, 0, 12)).toBeTrue();
    });
  });

  describe('maximum date', () => {
    it('does not return a end date beyond the maximum date', () => {
      const START_DATE = new Date(1999, 0, 0);
      const MAX_DATE = new Date(START_DATE.getTime() + DAY_IN_MS);
      const END_DATE = new Date(MAX_DATE.getTime() + DAY_IN_MS);
      const { end } = requestRange({
        start: START_DATE,
        end: END_DATE,
        max: MAX_DATE,
      });
      expect(end).toEqual(MAX_DATE);
    });

    it('does not return a start date beyond the maximum date', () => {
      const MAX_DATE = new Date(1999, 0, 0);
      const START_DATE = new Date(MAX_DATE.getTime() + DAY_IN_MS);
      const END_DATE = new Date(START_DATE.getTime() + DAY_IN_MS);
      const { start } = requestRange({
        start: START_DATE,
        end: END_DATE,
        max: MAX_DATE,
      });
      expect(start).toEqual(MAX_DATE);
    });
  });
});

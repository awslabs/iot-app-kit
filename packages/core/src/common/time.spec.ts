import {
  convertMS,
  DAY_IN_MS,
  displayDate,
  HOUR_IN_MS,
  MINUTE_IN_MS,
  MONTH_IN_MS,
  SECOND_IN_MS,
  YEAR_IN_MS,
} from './time';

describe('convert from milliseconds', () => {
  it('throws an error when input milliseconds is less than 0', () => {
    expect(() => convertMS(-1)).toThrowError();
  });

  it('converts from 1000 milliseconds to 1 second', () => {
    const convertedMS = convertMS(SECOND_IN_MS);
    expect(convertedMS).toEqual({
      seconds: 1,
      minute: 0,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 2000 milliseconds to 2 second', () => {
    const convertedMS = convertMS(SECOND_IN_MS * 2);
    expect(convertedMS).toEqual({
      seconds: 2,
      minute: 0,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 2005 milliseconds to 2 second', () => {
    const convertedMS = convertMS(SECOND_IN_MS * 2 + 5);
    expect(convertedMS).toEqual({
      seconds: 2,
      minute: 0,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 60000 milliseconds to 1 min', () => {
    const convertedMS = convertMS(MINUTE_IN_MS);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 1,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 120000 milliseconds to 2 min', () => {
    const convertedMS = convertMS(MINUTE_IN_MS * 2);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 2,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 120100 milliseconds to 2 min', () => {
    const convertedMS = convertMS(MINUTE_IN_MS * 2 + 100);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 2,
      hour: 0,
      day: 0,
    });
  });

  it('converts from 1 hr in milliseconds to 1 hr', () => {
    const convertedMS = convertMS(HOUR_IN_MS);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 1,
      day: 0,
    });
  });

  it('converts from 2 hr in milliseconds to 2 hr', () => {
    const convertedMS = convertMS(HOUR_IN_MS * 2);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 2,
      day: 0,
    });
  });

  it('converts from 2 hr and 100 milliseconds in milliseconds to 2 hr', () => {
    const convertedMS = convertMS(HOUR_IN_MS * 2 + 100);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 2,
      day: 0,
    });
  });

  it('converts from 1 day in milliseconds to 1 day', () => {
    const convertedMS = convertMS(DAY_IN_MS);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 0,
      day: 1,
    });
  });

  it('converts from 2 day in milliseconds to 2 day', () => {
    const convertedMS = convertMS(DAY_IN_MS * 2);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 0,
      day: 2,
    });
  });

  it('converts from 2 day and 100 milliseconds in milliseconds to 2 day', () => {
    const convertedMS = convertMS(DAY_IN_MS * 2);
    expect(convertedMS).toEqual({
      seconds: 0,
      minute: 0,
      hour: 0,
      day: 2,
    });
  });
});

describe('display date', () => {
  const SOME_DATE = new Date(2000, 0, 0);

  describe('with raw resolution', () => {
    it('returns timestamp with minutes and seconds for viewport in the scale of seconds', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 0, 0, 0, 0, 10),
        })
      ).toBe('00:00');
    });

    it('returns a timestamp with hours, minutes, and seconds for a viewport in the scale of minutes', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 0, 0, 0, 5),
        })
      ).toBe('12:00:00 AM');
    });

    it('returns a timestamp with minutes and hours for a viewport larger than a handful of minutes', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 0, 0, 0, 20),
        })
      ).toBe('12:00 AM');
    });

    it('returns a timestamp with day, month and hour for a day of time', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 0, 1),
        })
      ).toBe('12/31, 12:00 AM');
    });

    it('returns a timestamp with day, month and year for a month time span', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        })
      ).toBe('12/31/1999');
    });

    it('returns a timestamp with day, month and year for a absolutely massive viewport', () => {
      expect(
        displayDate(SOME_DATE, 0, {
          start: new Date(2000, 0, 0),
          end: new Date(2020, 0, 0),
        })
      ).toBe('12/31/1999');
    });
  });

  describe('with a non-raw resolution', () => {
    it('returns a timestamp with minutes and seconds for a granular resolution and small viewport', () => {
      expect(
        displayDate(SOME_DATE, 2, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 0, 0, 0, 0, 10),
        })
      ).toBe('00:00');
    });

    it('returns a timestamp stamp with month day and hour if given a resolution of one hour', () => {
      expect(
        displayDate(SOME_DATE, HOUR_IN_MS, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        })
      ).toBe('12/31, 12 AM');
    });

    it('returns a timestamp with a day, month, day and year if given a day long resolution', () => {
      expect(
        displayDate(SOME_DATE, DAY_IN_MS, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        })
      ).toBe('12/31/1999');
    });

    it('returns a timestamp with a day, month and year if given a month long resolution', () => {
      expect(
        displayDate(SOME_DATE, MONTH_IN_MS, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        })
      ).toBe('12/31/1999');
    });

    it('returns a timestamp with a day, month and year if given a year long resolution', () => {
      expect(
        displayDate(SOME_DATE, YEAR_IN_MS, {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        })
      ).toBe('12/31/1999');
    });
  });
});

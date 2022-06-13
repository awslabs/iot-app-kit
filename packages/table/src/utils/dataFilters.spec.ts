import { getDataBeforeDate } from './dataFilters';

describe('getDataBeforeDate', () => {
  const DATE = new Date(2000, 0, 0).getTime();
  it('returns empty list when given no data', () => {
    expect(getDataBeforeDate([], new Date())).toBeEmpty();
  });

  it('returns empty list when one point is given, and is after the date', () => {
    expect(getDataBeforeDate([{ x: new Date(2002, 0, 0).getTime(), y: 100 }], new Date(DATE))).toBeEmpty();
  });

  it('returns data point when given one data point at the date', () => {
    const DATA_POINT = { x: DATE, y: 100 };
    expect(getDataBeforeDate([DATA_POINT], new Date(DATE))).toEqual([DATA_POINT]);
  });

  it('returns empty list when all dates are after the given date', () => {
    expect(
      getDataBeforeDate(
        [
          { x: new Date(2001, 0, 0).getTime(), y: 100 },
          { x: new Date(2002, 0, 0).getTime(), y: 100 },
        ],
        new Date(DATE)
      )
    ).toBeEmpty();
  });

  it('returns all data points when all are at or before given date', () => {
    const DATA = [
      { x: new Date(1999, 0, 0).getTime(), y: 100 },
      { x: DATE, y: 100 },
    ];
    expect(getDataBeforeDate(DATA, new Date(DATE))).toEqual(DATA);
  });

  it('filters out data that is after the date', () => {
    const DATA = [
      { x: new Date(1999, 0, 0).getTime(), y: 100 },
      { x: new Date(2001, 0, 0).getTime(), y: 100 },
    ];
    expect(getDataBeforeDate(DATA, new Date(DATE))).toEqual([DATA[0]]);
  });
});

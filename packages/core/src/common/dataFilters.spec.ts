import { getDataBeforeDate, getVisibleData } from './dataFilters';
import { MINUTE_IN_MS, MONTH_IN_MS } from './time';
import type { Viewport } from '../data-module/data-cache/requestTypes';

const VIEW_PORT: Viewport = {
  start: new Date(2000, 0, 0, 0),
  end: new Date(2001, 0, 0, 0),
};

describe('getDataBeforeDate', () => {
  const DATE = new Date(2000, 0, 0).getTime();
  it('returns empty list when given no data', () => {
    expect(getDataBeforeDate([], new Date())).toBeEmpty();
  });

  it('returns empty list when one point is given, and is after the date', () => {
    expect(
      getDataBeforeDate(
        [{ x: new Date(2002, 0, 0).getTime(), y: 100 }],
        new Date(DATE)
      )
    ).toBeEmpty();
  });

  it('returns data point when given one data point at the date', () => {
    const DATA_POINT = { x: DATE, y: 100 };
    expect(getDataBeforeDate([DATA_POINT], new Date(DATE))).toEqual([
      DATA_POINT,
    ]);
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

describe('getVisibleData', () => {
  describe('get visible data ith a duration based view port', () => {
    it('with a single point out of view port, return an empty list', () => {
      const DURATION = MONTH_IN_MS;
      const DATA_POINT = {
        x: Date.now() - DURATION * 2,
        y: 100,
      };
      expect(
        getVisibleData([DATA_POINT], {
          duration: DURATION,
        })
      ).toBeEmpty();
    });

    it('with a single point after the view port, return an empty list', () => {
      const DURATION = MONTH_IN_MS;
      const DATA_POINT = {
        x: Date.now() + MINUTE_IN_MS,
        y: 100,
      };
      expect(
        getVisibleData([DATA_POINT], {
          duration: DURATION,
        })
      ).toBeEmpty();
    });

    it('with a single point within view port, return that point', () => {
      const DURATION = MONTH_IN_MS;
      const DATA_POINT = {
        x: Date.now() - DURATION * 0.5,
        y: 100,
      };
      expect(
        getVisibleData([DATA_POINT], {
          duration: DURATION,
        })
      ).toHaveLength(1);
    });
  });

  describe('get visible data to render within the chart, including boundary points', () => {
    it('returns an empty list when provided no data', () => {
      expect(getVisibleData([], VIEW_PORT)).toHaveLength(0);
    });

    it('returns nothing for a single point beyond the end date', () => {
      const data = [{ x: new Date(2999, 1, 0).getTime(), y: 1 }];
      const viewport = {
        yMin: 0,
        yMax: 100,
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
      };
      expect(getVisibleData(data, viewport)).toHaveLength(0);
    });

    it('returns nothing for a single point before the start date', () => {
      const data = [{ x: new Date(999, 1, 0).getTime(), y: 1 }];
      const viewport = {
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
      };
      expect(getVisibleData(data, viewport)).toHaveLength(0);
    });

    it('returns data within the viewport date range', () => {
      const data = [
        { x: new Date(2000, 1, 0).getTime(), y: 1 },
        { x: new Date(2000, 2, 0).getTime(), y: 1 },
      ];
      const viewport = {
        start: new Date(2000, 0, 0),
        end: new Date(2001, 0, 0),
      };
      expect(getVisibleData(data, viewport)).toEqual(data);
    });

    it('returns the two closest points to the view port to include in the visible data', () => {
      const visibleData = [
        { x: new Date(1999, 0, 0).getTime(), y: 1 },
        { x: new Date(2000, 0, 15).getTime(), y: 1 },
        { x: new Date(2001, 0, 0).getTime(), y: 1 },
      ];
      const data = [
        { x: new Date(1998, 0, 0).getTime(), y: 1 },
        ...visibleData,
        { x: new Date(2002, 0, 0).getTime(), y: 1 },
      ];
      const viewport = {
        start: new Date(2000, 0, 0),
        end: new Date(2000, 1, 0),
      };
      expect(getVisibleData(data, viewport)).toEqual(visibleData);
    });

    describe('get visible data to render within the chart, not including boundary points', () => {
      it('returns nothing for a single point beyond the end date', () => {
        const data = [{ x: new Date(2999, 1, 0).getTime(), y: 1 }];
        const viewport = {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
        };
        expect(getVisibleData(data, viewport, false)).toHaveLength(0);
      });

      it('returns nothing for a single point before the start date', () => {
        const data = [{ x: new Date(999, 1, 0).getTime(), y: 1 }];
        const viewport = {
          start: new Date(2000, 0, 0),
          end: new Date(2001, 0, 0),
        };
        expect(getVisibleData(data, viewport, false)).toHaveLength(0);
      });

      it('only returns points within viewport', () => {
        const data = [
          { x: new Date(1999, 0, 0).getTime(), y: 1 },
          { x: new Date(2000, 0, 15).getTime(), y: 1 },
          { x: new Date(2001, 0, 0).getTime(), y: 1 },
        ];
        const viewport = {
          start: new Date(2000, 0, 0),
          end: new Date(2000, 1, 0),
        };
        expect(getVisibleData(data, viewport, false)).toEqual([data[1]]);
      });
    });
  });
});

import { bisector } from 'd3-array';
import { sub, add } from 'date-fns';
import { timeSeriesDataFilterer } from './filterTimeSeriesData';
import { ANCHOR_DATE } from '../intervals/utils/testData';

describe('timeSeriesDataFilterer', () => {
  const pointToMilliseconds = (point: { x: Date }) => {
    return point.x.getTime();
  };

  const pointBisector = bisector((p: { x: Date }) => pointToMilliseconds(p));

  const filterPoints = timeSeriesDataFilterer(
    pointBisector,
    pointToMilliseconds
  );

  describe('get visible data to render within the chart, including boundary points', () => {
    it('returns an empty list when provided no data', () => {
      expect(
        filterPoints([], {
          start: sub(ANCHOR_DATE, { minutes: 10 }),
          end: add(ANCHOR_DATE, { minutes: 5 }),
        })
      ).toHaveLength(0);
    });

    it('returns an empty list when a point is outside the viewport', () => {
      expect(
        filterPoints(
          [{ x: ANCHOR_DATE }],
          {
            start: sub(ANCHOR_DATE, { minutes: 10 }),
            end: sub(ANCHOR_DATE, { minutes: 5 }),
          },
          false
        )
      ).toHaveLength(0);
    });

    it('returns data within the viewport date range', () => {
      expect(
        filterPoints(
          [{ x: ANCHOR_DATE }, { x: sub(ANCHOR_DATE, { minutes: 1 }) }],
          { start: sub(ANCHOR_DATE, { minutes: 10 }), end: ANCHOR_DATE }
        )
      ).toHaveLength(2);
    });

    it('returns the two closest points to the view port to include in the visible data', () => {
      expect(
        filterPoints(
          [
            { x: sub(ANCHOR_DATE, { minutes: 6 }) },
            { x: sub(ANCHOR_DATE, { minutes: 5 }) },
            { x: sub(ANCHOR_DATE, { minutes: 4 }) },
            { x: sub(ANCHOR_DATE, { minutes: 3 }) },
            { x: sub(ANCHOR_DATE, { minutes: 2 }) },
            { x: sub(ANCHOR_DATE, { minutes: 1 }) },
            { x: ANCHOR_DATE },
            { x: add(ANCHOR_DATE, { minutes: 1 }) },
            { x: add(ANCHOR_DATE, { minutes: 2 }) },
            { x: add(ANCHOR_DATE, { minutes: 3 }) },
          ],
          {
            start: sub(ANCHOR_DATE, { minutes: 4 }),
            end: sub(ANCHOR_DATE, { minutes: 1 }),
          }
        )
      ).toHaveLength(6);
    });
  });

  describe('get visible data to render within the chart, not including boundary points', () => {
    it('only returns points within viewport', () => {
      expect(
        filterPoints(
          [
            { x: sub(ANCHOR_DATE, { minutes: 5 }) },
            { x: sub(ANCHOR_DATE, { minutes: 4 }) },
            { x: sub(ANCHOR_DATE, { minutes: 3 }) },
            { x: sub(ANCHOR_DATE, { minutes: 2 }) },
            { x: sub(ANCHOR_DATE, { minutes: 1 }) },
            { x: ANCHOR_DATE },
          ],
          {
            start: sub(ANCHOR_DATE, { minutes: 4 }),
            end: sub(ANCHOR_DATE, { minutes: 1 }),
          },
          false
        )
      ).toHaveLength(4);
    });
  });
});

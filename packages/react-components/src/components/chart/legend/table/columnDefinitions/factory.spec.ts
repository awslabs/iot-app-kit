import { TrendCursor } from '../types';
import { createTableLegendColumnDefinitions } from './factory';

describe('legend table column definitions', () => {
  it('returns the datastream column definition by default', () => {
    const columnDefinitions = createTableLegendColumnDefinitions({
      trendCursors: [],
      width: 100,
    });
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([expect.toBeObject()])
    );
  });
  it('correctly orders trendcurors', () => {
    const trendCursors: TrendCursor[] = [
      {
        id: 'trendcursor-2',
        date: 1705433882789,
        color: 'green',
      },
      {
        id: 'trendcursor-1',
        date: 1705433860094,
        color: 'black',
      },
    ];
    const columnDefinitions = createTableLegendColumnDefinitions({
      trendCursors,
      width: 100,
    });
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.toBeObject(),
        expect.objectContaining({
          id: 'trendcursor-1',
        }),
        expect.objectContaining({
          id: 'trendcursor-2',
        }),
      ])
    );
  });
});

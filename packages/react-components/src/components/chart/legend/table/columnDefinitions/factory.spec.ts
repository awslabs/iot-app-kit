import { TrendCursor } from '../types';
import { createTableLegendColumnDefinitions } from './factory';

describe('legend table column definitions', () => {
  it('returns the datastream column definition by default', () => {
    const columnDefinitions = createTableLegendColumnDefinitions({
      trendCursors: [],
      width: 100,
      visibleContent: {},
      significantDigits: 0,
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
      visibleContent: {},
      significantDigits: 0,
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

  it('asset name and latest value columns are added when asset name and latestvalue visible is true', () => {
    const columnDefinitions = createTableLegendColumnDefinitions({
      trendCursors: [],
      width: 100,
      visibleContent: {
        asset: true,
        latestValue: true,
      },
      significantDigits: 0,
    });
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.toBeObject(),
        expect.objectContaining({
          id: 'AssetName',
        }),
        expect.objectContaining({
          id: 'Latest Value',
        }),
      ])
    );
  });

  it('asset name and latest value columns are not added when asset name and latestvalue visibility is false', () => {
    const columnDefinitions = createTableLegendColumnDefinitions({
      trendCursors: [],
      width: 100,
      visibleContent: {
        latestValue: false,
        asset: false,
      },
      significantDigits: 0,
    });
    expect(columnDefinitions).toEqual(
      expect.arrayContaining([
        expect.toBeObject(),
        expect.not.objectContaining({
          id: 'AssetName',
        }),
        expect.not.objectContaining({
          id: 'Latest Value',
        }),
      ])
    );
  });
});

import { createTestModel } from '../model';
import { closestTrendCursor } from './closestTrendCursor';

describe('closestTrendCursor', () => {
  it('can find a trendCursorModel closest to a given date', () => {
    const date = 0;

    const model = createTestModel({
      id: 'trendcursor-1',
      group: 'trendcursor-group-1',
      date: 1705685418155,
    });

    expect(closestTrendCursor(date, [model])).toEqual(model);
  });

  it('finds the closest model relative to the date', () => {
    const date = 1705689018155;

    const model1 = createTestModel({
      id: 'trendcursor-1',
      group: 'trendcursor-group-1',
      date: 1705685418155,
    });

    const model2 = createTestModel({
      id: 'trendcursor-1',
      group: 'trendcursor-group-1',
      date: 1705653018155,
    });

    expect(closestTrendCursor(date, [model1, model2])).toEqual(model1);
  });

  it('returns null if there are no models', () => {
    const date = 1705689018155;

    expect(closestTrendCursor(date, [])).toEqual(null);
  });
});

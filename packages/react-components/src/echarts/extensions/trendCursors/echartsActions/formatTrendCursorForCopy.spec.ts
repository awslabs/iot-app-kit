import { createTestModel } from '../model';
import { formatTrendCursorForCopy } from './formatTrendCursorForCopy';

const trendCursor = {
  id: 'trendcursor-1',
  group: 'trendcursor-group-1',
  date: 1705685418155,
};
const trendCursorValue1 = {
  id: 'trendcursorvalue-1',
  value: 5151,
  name: 'datastream-name-1',
  trendCursorId: 'trendcursor-1',
};
const trendCursorValue2 = {
  id: 'trendcursorvalue-2',
  value: 1111,
  name: 'datastream-name-2',
  trendCursorId: 'trendcursor-1',
};

describe('formatTrendCursorForCopy', () => {
  it('can format a trend cursor model as a string', () => {
    const model = createTestModel(trendCursor);

    const formatted = formatTrendCursorForCopy(model, [
      trendCursorValue1,
      trendCursorValue2,
    ]);

    // trend cursor information
    expect(formatted).toInclude('2024-01-19 5:30:18 p.m.');

    // datastream information
    expect(formatted).toInclude('datastream-name-1');
    expect(formatted).toInclude('5151');
    expect(formatted).toInclude('datastream-name-2');
    expect(formatted).toInclude('1111');
  });
});

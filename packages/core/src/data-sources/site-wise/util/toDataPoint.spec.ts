import { toDataPoint, aggregateToDataPoint } from './toDataPoint';
import { secondsSinceEpoch } from './secondsSinceEpoch';
import { NANO_SECOND_IN_MS, SECOND_IN_MS } from '../../../common/time';

const DATE = new Date(2000, 0, 0);
const SECONDS = secondsSinceEpoch(DATE);

describe('toDataPoint', () => {
  it('converts correctly for a double value', () => {
    expect(
      toDataPoint({
        timestamp: { timeInSeconds: SECONDS },
        value: {
          doubleValue: 100.1,
        },
      })
    ).toEqual({
      x: DATE.getTime(),
      y: 100.1,
    });
  });

  it('converts timestamp to date correctly taking into account nanoseconds offset', () => {
    expect(
      toDataPoint({
        timestamp: {
          timeInSeconds: SECONDS,
          offsetInNanos: 1 / NANO_SECOND_IN_MS, // 1 millisecond offset
        },
        value: {
          doubleValue: 100.1,
        },
      })
    ).toEqual(
      expect.objectContaining({
        x: SECONDS * SECOND_IN_MS + 1,
      })
    );
  });

  it('ignores sub-millisecond level of precision', () => {
    expect(
      toDataPoint({
        timestamp: {
          timeInSeconds: SECONDS,
          offsetInNanos: 1000,
        },
        value: {
          doubleValue: 100.1,
        },
      })
    ).toEqual(
      expect.objectContaining({
        x: SECONDS * SECOND_IN_MS,
      })
    );
  });

  it('converts correctly for a integer value', () => {
    expect(
      toDataPoint({
        timestamp: { timeInSeconds: SECONDS },
        value: {
          integerValue: 100,
        },
      })
    ).toEqual({
      x: DATE.getTime(),
      y: 100,
    });
  });

  it('throws error when no property values passed in', () => {
    expect(() =>
      toDataPoint({
        timestamp: { timeInSeconds: SECONDS },
        value: {},
      })
    ).toThrowError();
  });

  it('converts correctly for a string value', () => {
    expect(
      toDataPoint({
        timestamp: { timeInSeconds: SECONDS },
        value: {
          stringValue: 'hello, world!',
        },
      })
    ).toEqual({
      x: DATE.getTime(),
      y: 'hello, world!',
    });
  });
});

describe('aggregateToDataPoint', () => {
  it.each(['average', 'count', 'maximum', 'minimum', 'sum'])('converts correctly for %s', (aggregationType) => {
    const timestamp = new Date(2000, 0, 0);

    expect(
      aggregateToDataPoint({
        timestamp,
        value: {
          [aggregationType as any]: 100,
        },
      })
    ).toEqual({
      x: timestamp.getTime(),
      y: 100,
    });
  });

  it('throws error when invalid aggregation type passed', () => {
    const timestamp = new Date(2000, 0, 0);

    expect(() => {
      aggregateToDataPoint({
        timestamp,
        value: {
          ['someInvalidAggregationType' as any]: 100,
        },
      });
    }).toThrowError();
  });
});

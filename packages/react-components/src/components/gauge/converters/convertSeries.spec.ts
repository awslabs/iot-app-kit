import { type Threshold } from '@iot-app-kit/core';
import { convertSeries } from './convertSeries';

describe('convertSeries', () => {
  it('returns only emptySeries and progressSeries when no thresholds are provided', () => {
    const settings = { yMin: 0, yMax: 100, gaugeThickness: 20 };
    const result = convertSeries({
      unit: '°C',
      significantDigits: 2,
      thresholds: [],
      settings,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ min: 0, max: 100 });
    expect(result[1]).toMatchObject({ min: 0, max: 100 });
  });

  it('includes thresholdSeries when valid thresholds are provided', () => {
    const settings = { yMin: 0, yMax: 100 };
    const thresholds: Threshold[] = [
      { value: 50, color: 'red', comparisonOperator: 'GT' },
    ];
    const result = convertSeries({
      unit: '°C',
      significantDigits: 2,
      thresholds,
      settings,
    });

    expect(result).toHaveLength(3);
    expect(result[2]).toMatchObject({ min: 0, max: 100 });
  });
});

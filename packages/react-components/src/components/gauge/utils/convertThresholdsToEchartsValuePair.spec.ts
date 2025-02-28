import { type Threshold } from '@iot-app-kit/core';
import { convertThresholdsToEchartsValuePair } from './convertThresholdsToEchartsValuePair';
import { DEFAULT_GAUGE_PROGRESS_COLOR } from '../constants';

const testThresholds: Threshold[] = [
  {
    color: 'red',
    value: 50,
    comparisonOperator: 'LT',
    description: 'Value is less than 50',
    severity: 1,
    dataStreamIds: ['stream-1'],
  },
  {
    color: 'green',
    value: 90,
    comparisonOperator: 'GTE',
    description: 'Value is greater than or equal to 100',
    severity: 2,
    dataStreamIds: ['stream-2', 'stream-3'],
    showValue: true,
  },
  {
    color: 'blue',
    value: 101,
    comparisonOperator: 'GT',
    description: 'Value is greater than 101',
    isEditable: true,
    id: 'threshold-101',
  },
  {
    color: 'yellow',
    value: 75,
    comparisonOperator: 'LTE',
    description: 'Value is less than or equal to 75',
  },
  {
    color: 'purple',
    value: 80,
    comparisonOperator: 'EQ',
    description: 'Value equals 80',
  },
  {
    color: 'orange',
    value: 90,
    comparisonOperator: 'CONTAINS',
    description: 'Contains value 90',
    isEditable: false,
  },
];

describe('convertThresholdsToEchartsValuePair', () => {
  it('can convert thresholds', () => {
    const convertedThresholds = convertThresholdsToEchartsValuePair({
      thresholds: testThresholds,
    });

    expect(convertedThresholds).toEqual([
      [0.4999999999, 'red'],
      [0.75, 'yellow'],
      [0.9, DEFAULT_GAUGE_PROGRESS_COLOR],
      [1, 'green'],
      [1, DEFAULT_GAUGE_PROGRESS_COLOR],
    ]);
  });
});

import { YAxisOptions } from '../../types';
import { DataStream, Threshold } from '@iot-app-kit/core';
import { padYAxis } from './padYAxis';

describe('test padYAxis', () => {
  it('does not update axis when values are manually set', () => {
    const expectedMin = -20;
    const expectedMax = 20;
    const mockYAxis: YAxisOptions = {
      yMin: expectedMin,
      yMax: expectedMax,
    };

    const mockThresholds: Threshold[] = [
      {
        comparisonOperator: 'EQ',
        color: '',
        value: 50,
      },
    ];

    const mockDataStreams: DataStream[] = [
      {
        id: 'abc-1',
        data: [],
        resolution: 0,
        name: 'name1',
      },
    ];

    const [actualMin, actualMax] = padYAxis(mockYAxis, mockThresholds, mockDataStreams);
    expect(actualMin).toEqual(expectedMin);
    expect(actualMax).toEqual(expectedMax);
  });

  it('only updates max if min is > 0', () => {
    const expectedMin = 0;
    const expectedMax = 200;
    const mockYAxis: YAxisOptions = {};

    const mockThresholds: Threshold[] = [
      {
        comparisonOperator: 'EQ',
        color: '',
        value: 150, // Max, padded to 200
      },
    ];

    const mockDataStreams: DataStream[] = [
      {
        id: 'abc-1',
        data: [
          { x: 1630005300000, y: 50 },
          { x: 1630005400000, y: 55 },
          { x: 1630005500000, y: 60 },
          { x: 1630005600000, y: 65 },
        ],
        resolution: 0,
        name: 'name1',
      },
    ];

    const [actualMin, actualMax] = padYAxis(mockYAxis, mockThresholds, mockDataStreams);
    expect(actualMin).toEqual(expectedMin);
    expect(actualMax).toEqual(expectedMax);
  });

  it('only updates min if max is < 0', () => {
    const expectedMin = -200;
    const expectedMax = 0;
    const mockYAxis: YAxisOptions = {};

    const mockThresholds: Threshold[] = [
      {
        comparisonOperator: 'EQ',
        color: '',
        value: -10,
      },
    ];

    const mockDataStreams: DataStream[] = [
      {
        id: 'abc-1',
        data: [
          { x: 1630005300000, y: -45 },
          { x: 1630005400000, y: -50 },
          { x: 1630005500000, y: -20 },
          { x: 1630005600000, y: -170 }, // Min, padded to -200
        ],
        resolution: 0,
        name: 'name1',
      },
    ];

    const [actualMin, actualMax] = padYAxis(mockYAxis, mockThresholds, mockDataStreams);
    expect(actualMin).toEqual(expectedMin);
    expect(actualMax).toEqual(expectedMax);
  });

  it('updates both min and max', () => {
    const expectedMin = -0.2;
    const expectedMax = 0.5;
    const mockYAxis: YAxisOptions = {
      yMin: expectedMin,
      yMax: expectedMax,
    };

    const mockThresholds: Threshold[] = [
      {
        comparisonOperator: 'EQ',
        color: '',
        value: -0.15, // Min, padded to -0.2
      },
    ];

    const mockDataStreams: DataStream[] = [
      {
        id: 'abc-1',
        data: [
          { x: 1630005300000, y: 0.123 },
          { x: 1630005400000, y: 0.095 },
          { x: 1630005500000, y: 0.244 },
          { x: 1630005600000, y: 0.41 }, // Max, padded to 0.5
        ],
        resolution: 0,
        name: 'name1',
      },
    ];

    const [actualMin, actualMax] = padYAxis(mockYAxis, mockThresholds, mockDataStreams);
    expect(actualMin).toEqual(expectedMin);
    expect(actualMax).toEqual(expectedMax);
  });

  it('updates both min and max for multiple data streams and thresholds', () => {
    const expectedMin = -80;
    const expectedMax = 90;
    const mockYAxis: YAxisOptions = {};

    const mockThresholds: Threshold[] = [
      {
        comparisonOperator: 'LTE',
        color: '',
        value: 77, // Max, padded to 90
      },
      {
        comparisonOperator: 'EQ',
        color: '',
        value: -20,
      },
    ];

    const mockDataStreams: DataStream[] = [
      {
        id: 'abc-1',
        data: [
          { x: 1630005300000, y: 55 },
          { x: 1630005400000, y: -40 },
          { x: 1630005500000, y: -65 }, // Min, padded to -80
          { x: 1630005600000, y: 70 },
        ],
        resolution: 0,
        name: 'name1',
      },
      {
        id: 'abc-2',
        data: [
          { x: 1630005300000, y: -40 },
          { x: 1630005400000, y: 0 },
          { x: 1630005500000, y: 6 },
          { x: 1630005600000, y: -3 },
        ],
        resolution: 0,
        name: 'name2',
      },
    ];

    const [actualMin, actualMax] = padYAxis(mockYAxis, mockThresholds, mockDataStreams);
    expect(actualMin).toEqual(expectedMin);
    expect(actualMax).toEqual(expectedMax);
  });
});

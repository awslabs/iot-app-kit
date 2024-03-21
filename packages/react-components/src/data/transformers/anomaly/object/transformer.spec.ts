import { DataSource } from '../../../types';
import { AnomalyObjectDataSource } from './datasource';
import { AnomalyObjectDataSourceTransformer } from './transformer';

const validDataSource: AnomalyObjectDataSource = {
  state: 'success',
  value: {
    styles: {
      color: ['pink'],
    },
    data: [
      {
        timestamp: '2024-03-21T21:37:02.000000',
        diagnostics: [
          {
            name: 'Diagnostic Name 1',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 2',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 3',
            value: 0.5,
          },
        ],
      },
      {
        timestamp: '2024-03-22T21:37:02.000000',
        diagnostics: [
          {
            name: 'Diagnostic Name 1',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 2',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 3',
            value: 0.5,
          },
        ],
      },
    ],
  },
};

const invalidDataSourcePropertyNames: DataSource = {
  state: 'success',
  value: {
    styles: {},
    data: [
      {
        time: '2024-03-22T21:37:02.000000',
        properties: [
          {
            name: 'Diagnostic Name 1',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 2',
            value: 0.25,
          },
          {
            name: 'Diagnostic Name 3',
            value: 0.5,
          },
        ],
      },
    ],
  },
};

const invalidDataSourceDataTypes: DataSource = {
  state: 'success',
  value: {
    styles: {},
    data: [
      {
        timestamp: 1000,
        diagnostics: [
          {
            name: 'Diagnostic Name 1',
            value: '0.25',
          },
          {
            name: 'Diagnostic Name 2',
            value: '0.25',
          },
          {
            name: 'Diagnostic Name 3',
            value: '0.5',
          },
        ],
      },
    ],
  },
};

describe('Anomaly Object transformer', () => {
  it('validates the datasource', () => {
    const transformer = new AnomalyObjectDataSourceTransformer();

    expect(transformer.canTransform(validDataSource)).toBeTrue();
    expect(
      transformer.canTransform(invalidDataSourcePropertyNames)
    ).toBeFalse();
    expect(transformer.canTransform(invalidDataSourceDataTypes)).toBeFalse();
  });

  it('correctly transforms the datasource', () => {
    const transformer = new AnomalyObjectDataSourceTransformer();

    const transformedData = transformer.transform(validDataSource);

    expect(transformedData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          timestamp: expect.toBeNumber(),
          diagnostic_0: expect.toBeNumber(),
          diagnostic_1: expect.toBeNumber(),
          diagnostic_2: expect.toBeNumber(),
        }),
      ])
    );
  });

  it('correctly describes the datasource', () => {
    const transformer = new AnomalyObjectDataSourceTransformer();

    const describedData = transformer.describe(validDataSource);

    expect(describedData).toEqual(
      expect.objectContaining({
        color: expect.arrayContaining([expect.toBeString()]),
        diagnostics: expect.arrayContaining([
          expect.objectContaining({
            id: expect.toBeString(),
            name: expect.toBeString(),
          }),
        ]),
      })
    );
  });
});

import {
  AnomalyObjectDataSource,
  AnomalyObjectDataSourceTransformer,
} from '../transformers/anomaly';
import { DataSource } from '../types';
import { DataSourceLoader } from './dataSourceLoader';

const validAnomalyObjectDataSource: AnomalyObjectDataSource = {
  state: 'success',
  value: {
    styles: {
      color: ['pink'],
    },
    data: [
      {
        timestamp: 1711078622000,
        prediction: 1,
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
        timestamp: 1711165022000,
        prediction: 1,
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

const unsupportedDataSource: DataSource = {
  state: 'success',
  value: {
    datastream: {},
  },
};

describe('Data Source Loader', () => {
  it('can transform datasources', () => {
    const anomalyTransformer = new AnomalyObjectDataSourceTransformer();

    const dataLoader = new DataSourceLoader([anomalyTransformer]);

    // specific transform types handled by the transformer tests
    expect(dataLoader.transform([validAnomalyObjectDataSource])).toBeArray();
  });

  it('can describe datasources', () => {
    const anomalyTransformer = new AnomalyObjectDataSourceTransformer();

    const dataLoader = new DataSourceLoader([anomalyTransformer]);

    // specific transform types handled by the transformer tests
    expect(dataLoader.describe([validAnomalyObjectDataSource])).toBeArray();
  });

  it('throws an error if the datasource is not handled', () => {
    const anomalyTransformer = new AnomalyObjectDataSourceTransformer();

    const dataLoader = new DataSourceLoader([anomalyTransformer]);

    expect(() =>
      dataLoader.transform([
        validAnomalyObjectDataSource,
        unsupportedDataSource,
      ])
    ).toThrow('DataSource type not supported');
    expect(() =>
      dataLoader.describe([validAnomalyObjectDataSource, unsupportedDataSource])
    ).toThrow('DataSource type not supported');
  });
});

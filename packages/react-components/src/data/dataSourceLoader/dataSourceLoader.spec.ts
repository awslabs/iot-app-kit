import {
  AnomalyObjectDataSource,
  AnomalyObjectDataSourceTransformer,
} from '../transformers/anomaly';
import {
  AnomalyArrowDataSource,
  AnomalyArrowDataSourceTransformer,
} from '../transformers/anomaly/arrow';
import { FieldType } from '../transformers/arrow';
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

const validAnomalyArrowDataSource: AnomalyArrowDataSource = {
  state: 'success',
  value: {
    data: {
      fields: [
        {
          name: 'time',
          type: FieldType.time,
          values: [1714676404000, 1714676405000, 1714676407000, 1714676408000],
        },
        {
          name: 'quality',
          type: FieldType.string,
          values: ['GOOD', 'GOOD', 'GOOD', 'GOOD'],
        },
        {
          name: 'anomaly_score',
          type: FieldType.number,
          values: [0.85666, 0.85684, 0.85702, 0.85721],
        },
        {
          name: 'prediction_reason',
          type: FieldType.string,
          values: [
            'ANOMALY_DETECTED',
            'ANOMALY_DETECTED',
            'ANOMALY_DETECTED',
            'ANOMALY_DETECTED',
          ],
        },
        {
          name: 'water_temperature',
          type: FieldType.number,
          values: [0.27978, 0.2796, 0.27943, 0.27925],
        },
        {
          name: 'ph',
          type: FieldType.number,
          values: [0.10578, 0.10573, 0.10569, 0.10564],
        },
        {
          name: 'room_humidity',
          type: FieldType.number,
          values: [0.10475, 0.1047, 0.10466, 0.10462],
        },
        {
          name: 'water_level',
          type: FieldType.number,
          values: [0.0801, 0.08007, 0.08003, 0.08],
        },
        {
          name: 'soil_moisture',
          type: FieldType.number,
          values: [0.10538, 0.10534, 0.1053, 0.10526],
        },
        {
          name: 'room_temperature',
          type: FieldType.number,
          values: [0.10742, 0.10739, 0.10735, 0.10731],
        },
        {
          name: 'light_intensity',
          type: FieldType.number,
          values: [0.21679, 0.21717, 0.21754, 0.21792],
        },
      ],
      length: 4,
      name: 'Hydroponic_Garden_1',
    },
  },
};

const unsupportedDataSource: DataSource = {
  state: 'success',
  value: {
    datastream: {},
  },
};

describe('Data Source Loader', () => {
  it('can transform different types of datasources', () => {
    const anomalyObjectTransformer = new AnomalyObjectDataSourceTransformer();
    const anomalyArrowTransformer = new AnomalyArrowDataSourceTransformer();

    const dataLoader = new DataSourceLoader([
      anomalyObjectTransformer,
      anomalyArrowTransformer,
    ]);

    // specific transform types handled by the transformer tests
    expect(
      dataLoader.transform([validAnomalyObjectDataSource])
    ).toBeArrayOfSize(1);
    expect(dataLoader.transform([validAnomalyArrowDataSource])).toBeArrayOfSize(
      1
    );
  });

  it('can transform datasources', () => {
    const anomalyObjectTransformer = new AnomalyObjectDataSourceTransformer();
    const anomalyArrowTransformer = new AnomalyArrowDataSourceTransformer();

    const dataLoader = new DataSourceLoader([
      anomalyObjectTransformer,
      anomalyArrowTransformer,
    ]);

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

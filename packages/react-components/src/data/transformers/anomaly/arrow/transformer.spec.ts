import { type DataFrame, FieldType } from '../../arrow';
import { type AnomalyArrowDataSource } from './datasource';
import { AnomalyArrowDataSourceTransformer } from './transformer';

const validAnomalyDataFrame: DataFrame = {
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
};

const invalidAnomalyDataFrame: DataFrame = {
  fields: [
    {
      name: 'timestamp',
      type: FieldType.time,
      values: [1714676404000, 1714676405000, 1714676407000, 1714676408000],
    },
    {
      name: 'quality',
      type: FieldType.string,
      values: ['GOOD', 'GOOD', 'GOOD', 'GOOD'],
    },
    {
      name: 'water_temperature',
      type: FieldType.number,
      values: [1, 1, 1, 1],
    },
  ],
  length: 4,
  name: 'Hydroponic_Garden_1',
};

const validAnomalyDataFrameWithOneAnomalousPoint: DataFrame = {
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
        'NO_ANOMALY_DETECTED',
        'ANOMALY_DETECTED',
        'NO_ANOMALY_DETECTED',
        'NO_ANOMALY_DETECTED',
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
};

const validDataSource: AnomalyArrowDataSource = {
  state: 'success',
  value: {
    data: validAnomalyDataFrame,
  },
};

const invalidDataSource: AnomalyArrowDataSource = {
  state: 'success',
  value: {
    data: invalidAnomalyDataFrame,
  },
};

const validDataSourceWithOneAnomalousDataPoint: AnomalyArrowDataSource = {
  state: 'success',
  value: {
    data: validAnomalyDataFrameWithOneAnomalousPoint,
  },
};

describe('Anomaly Arrow transformer', () => {
  it('validates the datasource', () => {
    const transformer = new AnomalyArrowDataSourceTransformer();

    expect(transformer.canTransform(validDataSource)).toBeTrue();
    expect(transformer.canTransform(invalidDataSource)).toBeFalse();
  });

  it('correctly transforms the datasource', () => {
    const transformer = new AnomalyArrowDataSourceTransformer();

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
    const transformer = new AnomalyArrowDataSourceTransformer();

    const describedData = transformer.describe(validDataSource);

    expect(describedData).toEqual(
      expect.objectContaining({
        diagnostics: expect.arrayContaining([
          expect.objectContaining({
            id: expect.toBeString(),
            name: expect.toBeString(),
          }),
        ]),
      })
    );
  });

  it('does not include points that are not anomalous', () => {
    const transformer = new AnomalyArrowDataSourceTransformer();

    const transformedData = transformer.transform(
      validDataSourceWithOneAnomalousDataPoint
    );

    expect(transformedData).toBeArrayOfSize(1);
  });
});

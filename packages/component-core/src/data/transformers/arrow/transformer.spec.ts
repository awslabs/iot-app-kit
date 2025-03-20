import { type Data, type DataSource } from '../../types';
import { type ArrowDataSource } from './dataSource';
import { type ArrowDataSourceValue } from './input';
import { ArrowDataSourceTransformer } from './transformer';

type TestArrowDataValue = {
  x: number;
  y: number;
};
type TestArrowDataSourceStyles = {
  color: string;
  decimalPlaces: number;
};
type TestArrowDataSourceValue = ArrowDataSourceValue<TestArrowDataSourceStyles>;
type TestArrowDataSource = ArrowDataSource<TestArrowDataSourceValue>;

class TestArrowTransformer extends ArrowDataSourceTransformer<
  TestArrowDataSourceValue,
  Data<TestArrowDataValue>,
  Record<string, string>
> {
  transform(): Data<TestArrowDataValue> {
    throw new Error('Method not implemented.');
  }

  describe(): Record<string, string> {
    throw new Error('Method not implemented.');
  }
}

const validDataSource: TestArrowDataSource = {
  state: 'success',
  value: {
    styles: {
      color: 'pink',
      decimalPlaces: 3,
    },
    data: {
      fields: [
        {
          name: 'time',
          type: 'time',
          values: [1714676404000, 1714676405000, 1714676407000, 1714676408000],
        },
        {
          name: 'quality',
          type: 'string',
          values: ['GOOD', 'GOOD', 'GOOD', 'GOOD'],
        },
        {
          name: 'water_temperature',
          type: 'number',
          values: [1, 1, 1, 1],
        },
      ],
      length: 4,
      name: 'Hydroponic_Garden_1',
    },
  },
};

const validDataSourceWithoutStyles: TestArrowDataSource = {
  state: 'success',
  value: {
    data: {
      fields: [
        {
          name: 'timestamp',
          type: 'time',
          values: [1714676404000, 1714676405000, 1714676407000, 1714676408000],
        },
        {
          name: 'quality',
          type: 'string',
          values: ['GOOD', 'GOOD', 'GOOD', 'GOOD'],
        },
        {
          name: 'water_temperature',
          type: 'number',
          values: [1, 1, 1, 1],
        },
      ],
      length: 4,
      name: 'Hydroponic_Garden_1',
    },
  },
};

const invalidDataSourceDataShape: DataSource = {
  state: 'success',
  value: {
    data: {
      // wrong property name
      values: [
        {
          name: 'timestamp',
          type: 'time',
          values: [1714676404000, 1714676405000, 1714676407000, 1714676408000],
        },
        {
          name: 'quality',
          type: 'string',
          values: ['GOOD', 'GOOD', 'GOOD', 'GOOD'],
        },
        {
          name: 'water_temperature',
          type: 'number',
          values: [1, 1, 1, 1],
        },
      ],
      length: 4,
      name: 'Hydroponic_Garden_1',
    },
  },
};

const dataSourceWithoutDataProperty: DataSource = {
  state: 'success',
  value: {
    datastream: {},
  },
};

describe('Arrow transformer', () => {
  it('validates the datasource', () => {
    const transformer = new TestArrowTransformer();

    expect(transformer.canTransform(validDataSource)).toBeTrue();
    expect(transformer.canTransform(validDataSourceWithoutStyles)).toBeTrue();
    expect(transformer.canTransform(invalidDataSourceDataShape)).toBeFalse();
    expect(transformer.canTransform(dataSourceWithoutDataProperty)).toBeFalse();
  });
});

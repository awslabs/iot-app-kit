import { Data, DataSource } from '../../types';
import { ObjectDataSource } from './dataSource';
import { ObjectDataSourceValue } from './input';
import { ObjectDataSourceTransformer } from './transformer';

type TestObjectDataValue = {
  x: number;
  y: number;
};
type TestObjectDataSourceStyles = {
  color: string;
  decimalPlaces: number;
};
type TestObjectDataSourceValue = ObjectDataSourceValue<
  TestObjectDataSourceStyles,
  TestObjectDataValue[]
>;
type TestObjectDataSource = ObjectDataSource<TestObjectDataSourceValue>;

class TestObjectTransformer extends ObjectDataSourceTransformer<
  TestObjectDataSourceValue,
  Data<TestObjectDataValue>,
  Record<string, string>
> {
  transform(): Data<TestObjectDataValue> {
    throw new Error('Method not implemented.');
  }
  describe(): Record<string, string> {
    throw new Error('Method not implemented.');
  }
}

const validDataSource: TestObjectDataSource = {
  state: 'success',
  value: {
    styles: {
      color: 'pink',
      decimalPlaces: 3,
    },
    data: [
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 2,
      },
    ],
  },
};

const validDataSourceWithoutStyles: TestObjectDataSource = {
  state: 'success',
  value: {
    data: [
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 2,
      },
    ],
  },
};

const invalidDataSourceDataShape: DataSource = {
  state: 'success',
  value: {
    data: {
      x: [1, 2, 3, 4],
      y: [1, 2, 3, 4],
    },
  },
};

const dataSourceWithoutDataProperty: DataSource = {
  state: 'success',
  value: {
    datastream: {},
  },
};

describe('Object transformer', () => {
  it('validates the datasource', () => {
    const transformer = new TestObjectTransformer();

    expect(transformer.canTransform(validDataSource)).toBeTrue();
    expect(transformer.canTransform(validDataSourceWithoutStyles)).toBeTrue();
    expect(transformer.canTransform(invalidDataSourceDataShape)).toBeFalse();
    expect(transformer.canTransform(dataSourceWithoutDataProperty)).toBeFalse();
  });
});

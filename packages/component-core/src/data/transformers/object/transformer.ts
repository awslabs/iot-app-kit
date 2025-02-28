import { type DataSource, type DataSourceTransformer } from '../../types';
import { type ObjectDataSource } from './dataSource';
import { type ObjectDataSourceValue } from './input';

/**
 * Abstract object transformer
 * Implements some generic datasource validation
 * to determine if the datasource is in object format
 */
export abstract class ObjectDataSourceTransformer<
  DataSourceValue extends ObjectDataSourceValue,
  TransformedData,
  Description
> implements DataSourceTransformer<TransformedData, Description>
{
  #validStyles(value: Record<'data', unknown>) {
    if ('styles' in value) {
      return typeof value.styles === 'object';
    }
    return true;
  }

  #validData(data: unknown) {
    return (
      data != null &&
      Array.isArray(data) &&
      data.every((obj) => typeof obj === 'object')
    );
  }

  canTransform(
    datasource: DataSource
  ): datasource is ObjectDataSource<DataSourceValue> {
    return (
      datasource.value != null &&
      typeof datasource.value === 'object' &&
      'data' in datasource.value &&
      this.#validData(datasource.value.data) &&
      this.#validStyles(datasource.value)
    );
  }

  abstract transform(
    dataSource: ObjectDataSource<DataSourceValue>
  ): TransformedData;
  abstract describe(dataSource: ObjectDataSource<DataSourceValue>): Description;
}

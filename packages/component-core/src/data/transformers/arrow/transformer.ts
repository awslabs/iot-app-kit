import { type DataSource, type DataSourceTransformer } from '../../types';
import { type ArrowDataSource } from './dataSource';
import { type ArrowDataSourceValue, FieldType } from './input';

/**
 * Abstract arrow transformer
 * Implements some generic datasource validation
 * to determine if the datasource is in arrow format
 */
export abstract class ArrowDataSourceTransformer<
  DataSourceValue extends ArrowDataSourceValue,
  TransformedData,
  Description
> implements DataSourceTransformer<TransformedData, Description>
{
  #validField(field: unknown, length: number) {
    return (
      field != null &&
      typeof field === 'object' &&
      'name' in field &&
      typeof field.name === 'string' &&
      'type' in field &&
      typeof field.type === 'string' &&
      Object.values(FieldType).includes(field.type as FieldType) &&
      'values' in field &&
      Array.isArray(field.values) &&
      field.values.length === length
    );
  }

  #validFields(data: object) {
    return (
      'fields' in data &&
      Array.isArray(data.fields) &&
      'length' in data &&
      typeof data.length === 'number' &&
      data.fields.every((field) =>
        this.#validField(field, data.length as number)
      )
    );
  }

  canTransform(
    datasource: DataSource
  ): datasource is ArrowDataSource<DataSourceValue> {
    return (
      datasource.value != null &&
      typeof datasource.value === 'object' &&
      'data' in datasource.value &&
      datasource.value.data != null &&
      typeof datasource.value.data === 'object' &&
      this.#validFields(datasource.value.data)
    );
  }

  abstract transform(
    dataSource: ArrowDataSource<DataSourceValue>
  ): TransformedData;

  abstract describe(dataSource: ArrowDataSource<DataSourceValue>): Description;
}

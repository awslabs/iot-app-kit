import { type DataSource } from '../../types';
import { type ObjectDataSourceValue } from './input';

export type ObjectDataSource<
  SpecificObjectDataValue extends ObjectDataSourceValue
> = DataSource<SpecificObjectDataValue>;

import { DataSource } from '../../types';
import { ObjectDataSourceValue } from './input';

export type ObjectDataSource<
  SpecificObjectDataValue extends ObjectDataSourceValue
> = DataSource<SpecificObjectDataValue>;

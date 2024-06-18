import { DataSource } from '../../types';
import { ArrowDataSourceValue } from './input';

export type ArrowDataSource<
  SpecificArrowDataValue extends ArrowDataSourceValue
> = DataSource<SpecificArrowDataValue>;

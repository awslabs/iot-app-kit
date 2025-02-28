import { type DataSource } from '../../types';
import { type ArrowDataSourceValue } from './input';

export type ArrowDataSource<
  SpecificArrowDataValue extends ArrowDataSourceValue
> = DataSource<SpecificArrowDataValue>;

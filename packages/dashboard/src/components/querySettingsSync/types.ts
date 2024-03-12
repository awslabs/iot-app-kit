import { type SelectProps } from '@cloudscape-design/components';

export type RefreshRateString = '1000' | '5000' | '10000' | '60000' | '300000';
export type RefreshRateOption = NonNullable<SelectProps['options']>[number] & {
  value: RefreshRateString;
};

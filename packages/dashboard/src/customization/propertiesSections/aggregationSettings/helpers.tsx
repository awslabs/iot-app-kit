import type { SelectProps } from '@cloudscape-design/components';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { LINE_AGGREGATION_OPTIONS, LINE_RESOLUTION_OPTIONS } from '../constants';

export const NONE_AGGREGATION = { label: 'No aggregation', value: undefined };

// replacing the underscore in aggregate names with a space
// ex: "STANDARD_DEVIATION" => "standard deviation"
export const aggregateToString = (aggregate?: string): string => {
  return aggregate ? aggregate.replace(/_/g, ' ').toLowerCase() : 'auto';
};

export const getAggregationOptions = (supportsRawData: boolean, dataTypes: Set<string>, resolution?: string) => {
  const dataTypeAggregations =
    dataTypes.has('STRING') || dataTypes.has('BOOLEAN')
      ? [{ label: 'Count', value: AggregateType.COUNT }]
      : LINE_AGGREGATION_OPTIONS;

  if (!supportsRawData) return dataTypeAggregations;
  return !resolution || resolution === '0' ? [...dataTypeAggregations, NONE_AGGREGATION] : dataTypeAggregations;
};

export const getResolutionOptions = (supportsRawData: boolean) => {
  if (!supportsRawData) return LINE_RESOLUTION_OPTIONS.filter((option: SelectProps.Option) => option.value !== '0');
  return LINE_RESOLUTION_OPTIONS;
};

import type { SelectProps } from '@cloudscape-design/components';
import { AggregateType } from '@aws-sdk/client-iotsitewise';

export const RESOLUTION_OPTIONS: SelectProps.Option[] = [
  { label: '1 min', value: '1m' },
  { label: '15 min', value: '15m' },
  { label: '1 hour', value: '1h' },
  { label: '1 day', value: '1d' },
  { label: 'Raw', value: '0' },
  { label: 'Autoselect', value: undefined },
];

export const AGGREGATION_OPTIONS: SelectProps.Option[] = [
  { label: 'Average', value: AggregateType.AVERAGE },
  { label: 'Count', value: AggregateType.COUNT },
  { label: 'Maximum', value: AggregateType.MAXIMUM },
  { label: 'Minimum', value: AggregateType.MINIMUM },
  { label: 'Standard deviation', value: AggregateType.STANDARD_DEVIATION },
  { label: 'Sum', value: AggregateType.SUM },
];

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
      : AGGREGATION_OPTIONS;

  if (!supportsRawData) return dataTypeAggregations;
  return !resolution || resolution === '0' ? [...dataTypeAggregations, NONE_AGGREGATION] : dataTypeAggregations;
};

export const getResolutionOptions = (supportsRawData: boolean) => {
  if (!supportsRawData) return RESOLUTION_OPTIONS.filter((option: SelectProps.Option) => option.value !== '0');
  return RESOLUTION_OPTIONS;
};

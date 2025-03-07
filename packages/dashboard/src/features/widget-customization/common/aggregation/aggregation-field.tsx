import { AggregateType } from '@aws-sdk/client-iotsitewise';
import {
  Select,
  type SelectOption,
} from '~/features/widget-customization/atoms/select';
import './aggregation-settings.css';
import FormField from '@cloudscape-design/components/form-field';

import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export type Aggregation = `${AggregateType}`;

export const AGGREGATION_OPTIONS = [
  { text: 'Average', value: AggregateType.AVERAGE },
  { text: 'Count', value: AggregateType.COUNT },
  { text: 'Maximum', value: AggregateType.MAXIMUM },
  { text: 'Minimum', value: AggregateType.MINIMUM },
  { text: 'Standard deviation', value: AggregateType.STANDARD_DEVIATION },
  { text: 'Sum', value: AggregateType.SUM },
] as const satisfies SelectOption<Aggregation>[];

export interface AggregationFieldProps {
  settingValue?: Aggregation | undefined;
  setSettingValue: SetSettingFn<Aggregation | undefined>;
}

export const AggregationField = ({
  settingValue,
  setSettingValue,
}: AggregationFieldProps) => {
  return (
    <FormField label='Aggregation'>
      <Select
        settingValue={settingValue}
        setSettingValue={setSettingValue}
        options={AGGREGATION_OPTIONS}
      />
    </FormField>
  );
};

import type { ComparisonOperator } from '@iot-app-kit/core';
import { FormField } from '@cloudscape-design/components';
import { useMemo } from 'react';
import {
  Select,
  type SelectOption,
} from '~/features/widget-customization/atoms/select';

import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export interface ComparisonOperatorSelectProps<
  SupportedOperator extends ComparisonOperator
> {
  comparisonOperator: NoInfer<SupportedOperator>;
  setComparisonOperator: SetSettingFn<NoInfer<SupportedOperator>>;
  /**
   * Optionally specify a list of supported operators.
   */
  supportedOperators?: SupportedOperator[];
}

export const ComparisonOperatorSelect = <
  SupportedOperator extends ComparisonOperator
>({
  comparisonOperator,
  setComparisonOperator,
  supportedOperators,
}: ComparisonOperatorSelectProps<SupportedOperator>) => {
  const options: SelectOption<SupportedOperator>[] = useMemo(() => {
    return supportedOperators?.map((operator) => {
      switch (operator) {
        case 'GT':
          return { text: '>', value: operator };
        case 'GTE':
          return { text: '>=', value: operator };
        case 'LT':
          return { text: '<', value: operator };
        case 'LTE':
          return { text: '<=', value: operator };
        case 'EQ':
          return { text: '=', value: operator };
        case 'CONTAINS':
          return { text: 'Contains', value: operator };
      }
    });
  }, [supportedOperators]) as SelectOption<SupportedOperator>[];

  return (
    <FormField label='Operator'>
      <Select
        settingValue={comparisonOperator}
        setSettingValue={setComparisonOperator}
        options={options}
      />
    </FormField>
  );
};

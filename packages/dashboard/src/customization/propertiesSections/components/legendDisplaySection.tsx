import Checkbox, {
  type CheckboxProps,
} from '@cloudscape-design/components/checkbox';
import FormField from '@cloudscape-design/components/form-field';
import type { FC } from 'react';
import { type ChartLegend } from '~/customization/widgets/types';
import { dropdownConsts } from '../constants';

type LegendDisplaySectionProps = {
  disabled?: boolean;
  visibleContent?: ChartLegend['visibleContent'];
  onChange: (visibleContent: ChartLegend['visibleContent']) => void;
};

const { legendDisplaylist } = dropdownConsts.legendDisplaySection;

export const LegendDisplaySection: FC<LegendDisplaySectionProps> = ({
  disabled = false,
  visibleContent,
  onChange,
}) => {
  const handleVisibleChange = (
    key: string,
    event: Parameters<NonNullable<CheckboxProps['onChange']>>[0]
  ) => {
    onChange({ ...visibleContent, [key]: event.detail.checked });
  };

  return (
    <FormField label='Display'>
      {legendDisplaylist.map(({ label, value }) => (
        <Checkbox
          onChange={(e) => {
            handleVisibleChange(value, e);
          }}
          checked={
            visibleContent
              ? visibleContent[value as keyof ChartLegend['visibleContent']]
              : true
          }
          disabled={disabled}
          key={value}
          data-testid={label}
        >
          {label}
        </Checkbox>
      ))}
    </FormField>
  );
};

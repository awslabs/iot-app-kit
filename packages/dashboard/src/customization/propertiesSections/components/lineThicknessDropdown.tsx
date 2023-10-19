import React from 'react';
import type { FC } from 'react';

import { FormField, Select } from '@cloudscape-design/components';

const defaultLineThicknessOption = { label: 'Normal', value: '2' };
const lineThicknessOptions = [
  { label: 'Thin', value: '1' },
  defaultLineThicknessOption,
  { label: 'Thick', value: '5' },
] as const;

type LineThicknessDropdownProps = {
  disabled?: boolean;
  lineThickness?: string;
  updateLineThickness: (lineStyle: string) => void;
};

export const LineThicknessDropdown: FC<LineThicknessDropdownProps> = ({
  disabled = false,
  lineThickness,
  updateLineThickness,
}) => {
  return (
    <FormField label='Thickness'>
      <Select
        disabled={disabled}
        selectedOption={lineThicknessOptions.find(({ value }) => value === lineThickness) ?? defaultLineThicknessOption}
        options={lineThicknessOptions}
        onChange={({ detail }) => {
          updateLineThickness(detail.selectedOption.value ?? defaultLineThicknessOption.value);
        }}
      />
    </FormField>
  );
};

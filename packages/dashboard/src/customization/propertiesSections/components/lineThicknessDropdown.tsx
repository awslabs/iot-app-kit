import React from 'react';
import type { FC } from 'react';

import { FormField, Select } from '@cloudscape-design/components';

const defaultLineThicknessOption = { label: 'Normal', value: 'normal' };
const lineThicknessOptions = [
  { label: 'Thin', value: 'thin' },
  defaultLineThicknessOption,
  { label: 'Thick', value: 'thick' },
] as const;

type LineThicknessDropdownProps = {
  disabled?: boolean;
};

export const LineThicknessDropdown: FC<LineThicknessDropdownProps> = ({ disabled = false }) => {
  return (
    <FormField label='Thickness'>
      <Select
        disabled={disabled}
        selectedOption={lineThicknessOptions.find(({ value }) => value === 'normal') ?? null}
        options={lineThicknessOptions}
      />
    </FormField>
  );
};

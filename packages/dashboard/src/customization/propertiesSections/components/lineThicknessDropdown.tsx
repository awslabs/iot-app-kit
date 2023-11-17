import React from 'react';
import type { FC } from 'react';

import { FormField, Select } from '@cloudscape-design/components';
import { dropdownConsts } from './dropdownConstants';

type LineThicknessDropdownProps = {
  disabled?: boolean;
  lineThickness?: string;
  updateLineThickness: (lineStyle: string) => void;
};

const lineThicknessData = dropdownConsts.lineThickness;

export const LineThicknessDropdown: FC<LineThicknessDropdownProps> = ({
  disabled = false,
  lineThickness,
  updateLineThickness,
}) => {
  return (
    <FormField label='Line thickness'>
      <Select
        disabled={disabled}
        selectedOption={
          lineThicknessData.lineThicknessOptions.find(({ value }) => value === lineThickness) ??
          lineThicknessData.defaultValue
        }
        options={lineThicknessData.lineThicknessOptions}
        onChange={({ detail }) => {
          updateLineThickness(detail.selectedOption.value ?? lineThicknessData.defaultValue.value);
        }}
      />
    </FormField>
  );
};

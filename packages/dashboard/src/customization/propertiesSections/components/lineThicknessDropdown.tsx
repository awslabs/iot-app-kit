import React from 'react';
import type { FC } from 'react';

import Select from '@cloudscape-design/components/select';
import FormField from '@cloudscape-design/components/form-field';
import { dropdownConsts } from '../constants';

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
          lineThicknessData.lineThicknessOptions.find(
            ({ value }) => value === lineThickness
          ) ?? lineThicknessData.defaultValue
        }
        options={lineThicknessData.lineThicknessOptions}
        onChange={({ detail }) => {
          updateLineThickness(
            detail.selectedOption.value ?? lineThicknessData.defaultValue.value
          );
        }}
      />
    </FormField>
  );
};

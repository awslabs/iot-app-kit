import React from 'react';
import type { FC } from 'react';
import { FormField, Select } from '@cloudscape-design/components';
import { dropdownConsts } from './dropdownConstants';

type LineStyleDropdownProps = {
  disabled?: boolean;
  lineStyle?: string;
  updatelineStyle: (lineStyle: string) => void;
};

const lineStyleData = dropdownConsts.lineStyle;

export const LineStyleDropdown: FC<LineStyleDropdownProps> = ({ disabled = false, lineStyle, updatelineStyle }) => {
  return (
    <FormField label='Line style'>
      <Select
        disabled={disabled}
        selectedOption={
          // Find the line style option that matches the currently selected line style
          lineStyleData.lineTypeOptions.find(({ value }) => value === lineStyle) ?? null
        }
        onChange={({ detail }) =>
          // Update the line style with the selected option value
          updatelineStyle(detail.selectedOption.value ?? lineStyleData.defaultValue.value)
        }
        options={lineStyleData.lineTypeOptions} // List of line style options
      />
    </FormField>
  );
};

import React from 'react';
import type { FC } from 'react';
import { FormField, Select } from '@cloudscape-design/components';

const defaultLineStyleOption = { label: 'Solid', value: 'solid' };
const lineStyleOptions = [
  defaultLineStyleOption,
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] as const;

type LineStyleDropdownProps = {
  disabled?: boolean;
  lineStyle?: string;
  updatelineStyle: (lineStyle: string) => void;
};

export const LineStyleDropdown: FC<LineStyleDropdownProps> = ({ disabled = false, lineStyle, updatelineStyle }) => {
  return (
    <FormField label='Style'>
      <Select
        disabled={disabled}
        selectedOption={
          // Find the line style option that matches the currently selected line style
          lineStyleOptions.find(({ value }) => value === lineStyle) ?? null
        }
        onChange={({ detail }) =>
          // Update the line style with the selected option value
          updatelineStyle(detail.selectedOption.value ?? defaultLineStyleOption.value)
        }
        options={lineStyleOptions} // List of line style options
      />
    </FormField>
  );
};

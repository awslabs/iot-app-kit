import React from 'react';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import { dropdownConsts } from '../constants';

type AlignmentDropdownProps = {
  disabled?: boolean;
  position?: string;
  onTypeChange: (position: string) => void;
};

const defaultOption = {
  label: 'Right',
  value: 'right',
};

const { legendAlignmentOptions, defaultValue } = dropdownConsts.legendAlignment;

export const AlignmentDropdown = ({ disabled = false, position, onTypeChange }: AlignmentDropdownProps) => {
  return (
    <FormField label='Alignment'>
      <Select
        disabled={disabled}
        selectedOption={legendAlignmentOptions.find(({ value }) => value === position) ?? defaultOption}
        onChange={({ detail }) => onTypeChange(detail.selectedOption.value ?? defaultValue.value)}
        options={legendAlignmentOptions}
      />
    </FormField>
  );
};

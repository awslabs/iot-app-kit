import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { FC } from 'react';
import React from 'react';
import { dropdownConsts } from './dropdownConstants';

type LineStyleSectionOptions = {
  dataPointStyle: string | undefined;
  updateDataPointStyle: (dataPointStyle: string) => void;
};

const dataPointData = dropdownConsts.dataPointStyle;

export const DataPointStyleSection: FC<LineStyleSectionOptions> = ({ dataPointStyle, updateDataPointStyle }) => {
  return (
    <FormField label='Data point shape'>
      <Select
        selectedOption={dataPointData.dataPointStyleOptions.find(({ value }) => value === dataPointStyle) ?? null}
        onChange={({ detail }) => updateDataPointStyle(detail.selectedOption.value ?? dataPointData.defaultValue.value)}
        options={dataPointData.dataPointStyleOptions}
      />
    </FormField>
  );
};

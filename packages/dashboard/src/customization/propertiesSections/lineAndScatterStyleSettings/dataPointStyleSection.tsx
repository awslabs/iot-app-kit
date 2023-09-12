import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { FC } from 'react';
import React from 'react';

const defaultDataPointStyleOption = { label: 'Filled circle', value: 'filled-circle', };
const dataPointStyleOptions = [
  defaultDataPointStyleOption,
  { label: 'Empty circle', value: 'circle' },
  { label: 'Rectangle', value: 'rectangle' },
  { label: 'Triangle', value: 'triangle' },
  { label: 'Diamond', value: 'diamond' },
  { label: 'Pin', value: 'pin' },
  { label: 'Arrow', value: 'arrow' },
] as const;

type LineStyleSectionOptions = {
  dataPointStyle: string | undefined;
  updateDataPointStyle: (dataPointStyle: string) => void;
};

export const DataPointStyleSection: FC<LineStyleSectionOptions> = ({
  dataPointStyle,
  updateDataPointStyle
}) => {
  
  return (
    <ExpandableSection headerText='Data point style' defaultExpanded>
      <FormField
        label="Style"
      >
        <Select
          selectedOption={dataPointStyleOptions.find(({ value }) => value === dataPointStyle) ?? null}
          onChange={({ detail }) =>
          updateDataPointStyle(detail.selectedOption.value ?? defaultDataPointStyleOption.value)
          }
          options={dataPointStyleOptions}
        />
      </FormField>
    </ExpandableSection>
  );
};

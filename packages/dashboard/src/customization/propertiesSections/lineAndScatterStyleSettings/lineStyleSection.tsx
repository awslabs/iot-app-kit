import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select from '@cloudscape-design/components/select';
import type { FC } from 'react';
import React from 'react';

const defaultLineStyleOption = { label: 'Solid', value: 'solid' };
const lineStyleOptions = [
  defaultLineStyleOption,
  { label: 'Dashed', value: 'dashed' },
  { label: 'Dotted', value: 'dotted' },
] as const;

type LineStyleSectionOptions = {
  lineStyle: string | undefined;
  updatelineStyle: (lineStyle: string) => void;
};

export const LineStyleSection: FC<LineStyleSectionOptions> = ({ lineStyle, updatelineStyle }) => {
  return (
    <ExpandableSection headerText='Line style' defaultExpanded>
      <FormField label='Style'>
        <Select
          selectedOption={lineStyleOptions.find(({ value }) => value === lineStyle) ?? null}
          onChange={({ detail }) => updatelineStyle(detail.selectedOption.value ?? defaultLineStyleOption.value)}
          options={lineStyleOptions}
        />
      </FormField>
    </ExpandableSection>
  );
};

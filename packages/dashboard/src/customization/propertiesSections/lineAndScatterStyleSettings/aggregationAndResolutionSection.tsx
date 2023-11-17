import { SpaceBetween, Box } from '@cloudscape-design/components';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import type { FC } from 'react';
import React from 'react';
import './lineAndScatterStyleSettings.css';

type AggregationAndResolutionSectionOptions = {
  aggregation: string | undefined;
  resolution: string | undefined;
  updateAggregation: (aggregation?: string) => void;
  updateResolution: (resolution?: string) => void;
  resolutionOptions: SelectProps.Option[];
  aggregationOptions: SelectProps.Option[];
};

export const AggregationAndResolutionSection: FC<AggregationAndResolutionSectionOptions> = ({
  aggregation,
  resolution,
  updateAggregation,
  updateResolution,
  resolutionOptions,
  aggregationOptions,
}) => {
  const selectedResolution = resolutionOptions.find(({ value }) => value === resolution) ?? null;
  const selectedAggregation = aggregationOptions.find(({ value }) => value === aggregation) ?? null;

  return (
    <ExpandableSection
      className='accordian-header'
      headerText='Resolution and Aggregation'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween direction='vertical' size='s'>
          <FormField label='Resolution'>
            <Select
              selectedOption={selectedResolution}
              onChange={({
                detail: {
                  selectedOption: { value: newResolution },
                },
              }) => {
                updateResolution(newResolution);
              }}
              options={resolutionOptions}
            />
          </FormField>
          <FormField label='Aggregation'>
            <Select
              selectedOption={selectedAggregation}
              onChange={({
                detail: {
                  selectedOption: { value: newAggregation },
                },
              }) => {
                updateAggregation(newAggregation);
              }}
              options={aggregationOptions}
            />
          </FormField>
        </SpaceBetween>
      </Box>
    </ExpandableSection>
  );
};

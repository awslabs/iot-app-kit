import React, { useState } from 'react';
import { FormField, Select, SelectProps } from '@cloudscape-design/components';
import { spaceScaledXs } from '@cloudscape-design/design-tokens';
import { ThresholdStyleType } from '@iot-app-kit/core';
import { OptionDefinition } from '@cloudscape-design/components/internal/components/option/interfaces';

export type ThresholdStyleSettingsProps = {
  thresholdStyle: ThresholdStyleType;
  updateAllThresholdStyles: (thresholdStyle: ThresholdStyleType) => void;
  convertThresholdStyleToOption: (
    thresholdStyle: ThresholdStyleType
  ) => OptionDefinition;
  convertOptionToThresholdStyle: (
    selectedOption: OptionDefinition
  ) => ThresholdStyleType;
  styledOptions: { label: string; value: string }[];
};

const style = {
  padding: spaceScaledXs,
};

export const ThresholdStyleSettings: React.FC<ThresholdStyleSettingsProps> = ({
  thresholdStyle,
  updateAllThresholdStyles,
  convertThresholdStyleToOption,
  convertOptionToThresholdStyle,
  styledOptions,
}) => {
  const [selectedOption, setSelectedOption] = useState<SelectProps.Option>(
    convertThresholdStyleToOption(thresholdStyle)
  );

  return (
    <div style={style}>
      <FormField label='Show thresholds'>
        <Select
          onChange={({ detail }) => {
            setSelectedOption(detail.selectedOption);
            const thresholdStyle = convertOptionToThresholdStyle(
              detail.selectedOption
            );
            // Update styles of all thresholds
            updateAllThresholdStyles(thresholdStyle);
          }}
          options={styledOptions}
          selectedOption={selectedOption}
        />
      </FormField>
    </div>
  );
};

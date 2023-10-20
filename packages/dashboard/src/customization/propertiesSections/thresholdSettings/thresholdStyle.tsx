import FormField from '@cloudscape-design/components/form-field';
import Select, { type SelectProps } from '@cloudscape-design/components/select';
import { ThresholdStyleType } from '@iot-app-kit/react-components/src/components/chart/types';
import React from 'react';

export interface ThresholdStyleSettingsProps {
  thresholdStyle: ThresholdStyleType;
  updateAllThresholdStyles: (thresholdStyle: ThresholdStyleType) => void;
}

type ThresholdStyle = 'lines' | 'filledRegion' | 'linesAndFilledRegion';

const thresholdStyleMapping: Record<string, SelectProps.Option & Record<'style', ThresholdStyleType>> = {
  lines: { label: 'As lines', style: { visible: true } },
  filledRegion: { label: 'As filled region', style: { visible: false, fill: 'color' } },
  linesAndFilledRegion: { label: 'As lines and filled region', style: { visible: true, fill: 'color' } },
};

const thresholdStyleOptions = Object.keys(thresholdStyleMapping).map((key) => ({
  label: thresholdStyleMapping[key].label,
  value: key,
}));

function getOptionFromStyle(thresholdStyle: ThresholdStyleType): SelectProps.Option {
  const key = Object.keys(thresholdStyleMapping).find(
    (k) => JSON.stringify(thresholdStyleMapping[k].style) === JSON.stringify(thresholdStyle)
  );
  return { label: thresholdStyleMapping[key ?? ''].label, value: key };
}

function getStyleFromOption(optionValue: ThresholdStyle): ThresholdStyleType {
  return thresholdStyleMapping[optionValue].style;
}

export function ThresholdStyleSettings({ thresholdStyle, updateAllThresholdStyles }: ThresholdStyleSettingsProps) {
  const selectedOption = getOptionFromStyle(thresholdStyle);

  return (
    <FormField label='Show thresholds'>
      <Select
        options={thresholdStyleOptions}
        selectedOption={selectedOption}
        onChange={({ detail: { selectedOption } }) => {
          const thresholdOptionValue = selectedOption.value as ThresholdStyle;
          const thresholdStyle = getStyleFromOption(thresholdOptionValue);
          updateAllThresholdStyles(thresholdStyle);
        }}
      />
    </FormField>
  );
}

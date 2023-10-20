import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Select, { type SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { ComparisonOperator } from '@iot-app-kit/core';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

import { DEFAULT_THRESHOLD_COLOR, OPS_ALLOWED_WITH_STRING } from './defaultValues';
import { useThreshold } from './useThreshold';
import ColorPicker from '../shared/colorPicker';
import type { ThresholdWithId } from '~/customization/settings';

interface ThresholdFormListItemProps {
  threshold: ThresholdWithId;
  thresholds: ThresholdWithId[];
  updateThresholds: (updatedThresholds: ThresholdWithId[]) => void;
  comparisonOptions: SelectProps.Option[];
}

export function ThresholdFormListItem({
  threshold,
  thresholds,
  updateThresholds,
  comparisonOptions,
}: ThresholdFormListItemProps) {
  const { updateThresholdValue, updateComparisonOperator, updateThresholdColor, deleteThreshold } = useThreshold({
    threshold,
    thresholds,
    updateThresholds,
  });

  const { control, trigger, getValues } = useForm({
    defaultValues: {
      color: threshold.color ?? DEFAULT_THRESHOLD_COLOR,
      comparisonOperator:
        comparisonOptions.find(({ value = '' }) => threshold.comparisonOperator === value) ?? comparisonOptions[0],
      thresholdValue: threshold.value,
    },
    mode: 'onChange',
  });

  return (
    <SpaceBetween direction='horizontal' size='s' alignItems='center'>
      <Box variant='span'>If</Box>
      <Controller
        control={control}
        name='comparisonOperator'
        render={({ field }) => (
          <Select
            expandToViewport={true}
            options={comparisonOptions}
            selectedOption={field.value}
            onChange={(event) => {
              updateComparisonOperator(event.detail.selectedOption.value as ComparisonOperator);
              field.onChange(event.detail.selectedOption);
              trigger('thresholdValue');
            }}
          />
        )}
      />
      <Controller
        control={control}
        name='thresholdValue'
        rules={{
          validate: (value) => {
            const notAllowString = !OPS_ALLOWED_WITH_STRING.find((op) => getValues('comparisonOperator').value === op);
            const parsedValue = parseFloat(value as string);

            return !(Number.isNaN(parsedValue) && notAllowString);
          },
        }}
        render={({ field, fieldState }) => (
          <Input
            invalid={fieldState.invalid}
            value={field.value as string}
            placeholder='Threshold value'
            onChange={(event) => {
              const value = parseFloat(event.detail.value);
              const updatedValue = Number.isNaN(value) ? event.detail.value : value;
              updateThresholdValue(updatedValue);
              field.onChange(event.detail.value);
            }}
          />
        )}
      />
      <Box variant='span'>show as</Box>
      <Controller
        control={control}
        name='color'
        render={({ field }) => (
          <ColorPicker
            color={field.value}
            updateColor={(color) => {
              updateThresholdColor(color);
              field.onChange(color);
            }}
          />
        )}
      />
      <Button iconName='remove' variant='icon' onClick={deleteThreshold} />
    </SpaceBetween>
  );
}

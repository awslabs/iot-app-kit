import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Input, { type InputProps } from '@cloudscape-design/components/input';
import Select, { type SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import type { ComparisonOperator, Threshold, ThresholdValue } from '@iot-app-kit/core';
import React, { useCallback, useEffect, useState, type FC } from 'react';

import { DEFAULT_THRESHOLD_COLOR, OPS_ALLOWED_WITH_STRING } from './defaultValues';
import ColorPicker from '../shared/colorPicker';
import type { ThresholdWithId } from '~/customization/settings';

export const ThresholdComponent: FC<{
  threshold: ThresholdWithId;
  comparisonOptions: SelectProps.Option[];
  onDelete: () => void;
  onUpdateValue: (value: Threshold['value']) => void;
  onUpdateComparisonOperator: (value: Threshold['comparisonOperator']) => void;
  onUpdateColor: (value: Threshold['color']) => void;
}> = ({ threshold, comparisonOptions, onDelete, onUpdateValue, onUpdateComparisonOperator, onUpdateColor }) => {
  const [validValue, updateValidValue] = useState<boolean>(true);

  // To support decimal values, the displayed value and threshold value must be different. This supports
  // input states where the decimal isn't fully typed out yet, like '33.'.
  const [displayValue, updateDisplayValue] = useState<ThresholdValue>(threshold.value);

  const { color, comparisonOperator, value } = threshold;

  const validateValue: (value: ThresholdValue) => boolean = useCallback(
    (value: ThresholdValue) => {
      const notAllowString = !OPS_ALLOWED_WITH_STRING.find((op) => comparisonOperator === op);
      const parsedValue = parseFloat(value as string);

      return !(Number.isNaN(parsedValue) && notAllowString);
    },
    [comparisonOperator]
  );

  useEffect(() => {
    const validation = validateValue(value);
    if (validation !== validValue) updateValidValue(validateValue(value));
  }, [value, validValue, validateValue, comparisonOperator]);

  const selectedOption =
    comparisonOptions.find(({ value = '' }) => value === comparisonOperator) || comparisonOptions[0];

  const onUpdateComparator: SelectProps['onChange'] = ({ detail }) => {
    onUpdateComparisonOperator(detail.selectedOption.value as ComparisonOperator);
  };

  const onUpdateThresholdValue: InputProps['onChange'] = ({ detail }) => {
    const value = parseFloat(detail.value);
    const updatedValue = Number.isNaN(value) ? detail.value : value;
    onUpdateValue(updatedValue);

    updateDisplayValue(detail.value);
  };

  return (
    <SpaceBetween direction='horizontal' size='xs' alignItems='center' data-test-id='threshold-component'>
      <Box variant='span'>If</Box>
      <Select
        expandToViewport={true}
        options={comparisonOptions}
        selectedOption={selectedOption}
        onChange={onUpdateComparator}
        data-test-id='threshold-component-operator-select'
      />
      <Input
        value={`${displayValue}`}
        placeholder='Threshold value'
        onChange={onUpdateThresholdValue}
        data-test-id='threshold-component-value-input'
        invalid={!validValue}
      />
      <Box variant='span'>show</Box>
      <ColorPicker
        color={color || DEFAULT_THRESHOLD_COLOR}
        updateColor={onUpdateColor}
        data-test-id='threshold-component-color-picker'
      />
      <Button iconName='remove' variant='icon' onClick={onDelete} data-test-id='threshold-component-delete-button' />
    </SpaceBetween>
  );
};

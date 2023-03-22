import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import type { ComparisonOperator, Threshold, ThresholdValue } from '@iot-app-kit/core';
import type { InputProps, SelectProps } from '@cloudscape-design/components';
import { Box, Button, Input, Select, SpaceBetween } from '@cloudscape-design/components';

import { DEFAULT_THRESHOLD_COLOR, OPS_ALLOWED_WITH_STRING } from './defaultValues';
import ColorPicker from '../../shared/colorPicker';
import type { ThresholdWithId } from '~/customization/settings';

import * as awsui from '@cloudscape-design/design-tokens';

import './thresholdComponent.css';

const defaultMessages = {
  if: 'if',
  title: 'Threshold',
  containsLabel: 'Contains',
  thresholdPlaceHolder: 'Threshold value',
};

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

  const validateValue: (value: ThresholdValue) => boolean = (value: ThresholdValue) => {
    const notAllowString = !OPS_ALLOWED_WITH_STRING.find((op) => comparisonOperator === op);
    const parsedValue = parseFloat(value as string);
    if (value === '') {
      return false;
    }

    return !(Number.isNaN(parsedValue) && notAllowString);
  };

  useEffect(() => {
    const validation = validateValue(value);
    if (validation !== validValue) updateValidValue(validateValue(value));
  }, [value, comparisonOperator]);

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
    <div className='threshold-display' data-test-id='threshold-component'>
      <div className='threshold-display-summary'>
        <SpaceBetween size='xxxs'>
          <Box padding={{ top: 'xxs' }}>
            <div className='threshold-configuration' style={{ gap: awsui.spaceScaledS }}>
              <Box variant='span'>{defaultMessages.if}</Box>
              <Select
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
              <ColorPicker
                color={color || DEFAULT_THRESHOLD_COLOR}
                updateColor={onUpdateColor}
                data-test-id='threshold-component-color-picker'
              />
            </div>
          </Box>
        </SpaceBetween>
      </div>
      <Button iconName='close' variant='icon' onClick={onDelete} data-test-id='threshold-component-delete-button' />
    </div>
  );
};

import React, { useEffect, useState } from 'react';

import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { Button, Box, Input, Select, SpaceBetween } from '@cloudscape-design/components';

import { DEFAULT_THRESHOLD_COLOR, OPS_ALLOWED_WITH_STRING } from './defaultValues';
import ColorPicker from '../../shared/colorPicker';
import type { FC } from 'react';
import type { ThresholdValue } from '@synchro-charts/core';
import type { NonCancelableEventHandler } from '@cloudscape-design/components/internal/events';
import type { InputProps, SelectProps } from '@cloudscape-design/components';
import type { ThresholdSettings } from '~/customization/settings';

import * as awsui from '@cloudscape-design/design-tokens';

import './thresholdComponent.css';

const defaultMessages = {
  if: 'if',
  title: 'Threshold',
  containsLabel: 'Contains',
  thresholdPlaceHolder: 'Threshold value',
};

export const ThresholdComponent: FC<{
  threshold: ThresholdSettings['thresholds'][number];
  comparisonOptions: SelectProps.Option[];
  onDelete: () => void;
  onUpdateValue: (value: ThresholdSettings['thresholds'][number]['comparisonValue']) => void;
  onUpdateComparisonOperator: (value: ThresholdSettings['thresholds'][number]['comparisonOperator']) => void;
  onUpdateColor: (value: ThresholdSettings['thresholds'][number]['color']) => void;
}> = ({ threshold, comparisonOptions, onDelete, onUpdateValue, onUpdateComparisonOperator, onUpdateColor }) => {
  const [validValue, updateValidValue] = useState<boolean>(true);

  const { color, comparisonOperator, comparisonValue } = threshold;

  const validateValue: (value: ThresholdValue) => boolean = (value: ThresholdValue) => {
    const notAllowString = !OPS_ALLOWED_WITH_STRING.find((op) => comparisonOperator === op);
    const parsedValue = parseFloat(value as string);
    if (value === '') {
      return false;
    }

    return !(Number.isNaN(parsedValue) && notAllowString);
  };

  useEffect(() => {
    const validation = validateValue(comparisonValue);
    if (validation !== validValue) updateValidValue(validateValue(comparisonValue));
  }, [comparisonValue, comparisonOperator]);

  const selectedOption =
    comparisonOptions.find(({ value = '' }) => value === comparisonOperator) || comparisonOptions[0];

  const onUpdateComparator: NonCancelableEventHandler<SelectProps.ChangeDetail> = ({ detail }) => {
    onUpdateComparisonOperator(detail.selectedOption.value as COMPARISON_OPERATOR);
  };

  const onUpdateThresholdValue: NonCancelableEventHandler<InputProps.ChangeDetail> = ({ detail }) => {
    const value = parseFloat(detail.value);
    const updatedValue = Number.isNaN(value) ? detail.value : value;
    onUpdateValue(updatedValue);
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
                value={`${comparisonValue}`}
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

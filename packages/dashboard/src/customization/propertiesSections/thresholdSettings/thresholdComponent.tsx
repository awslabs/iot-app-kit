import type { FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

import type {
  ComparisonOperator,
  Threshold,
  ThresholdValue,
} from '@iot-app-kit/core';
import type { InputProps, SelectProps } from '@cloudscape-design/components';
import {
  Box,
  Button,
  FormField,
  Input,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';

import {
  DEFAULT_THRESHOLD_COLOR,
  OPS_ALLOWED_WITH_STRING,
} from './defaultValues';
import ColorPicker from '../shared/colorPicker';
import type { ThresholdWithId } from '../../../customization/settings';

import * as awsui from '@cloudscape-design/design-tokens';

import './thresholdComponent.css';

const defaultMessages = {
  if: 'If',
  title: 'Threshold',
  containsLabel: 'Contains',
  thresholdPlaceHolder: 'Threshold value',
  showAs: 'show as',
};

export const ThresholdComponent: FC<{
  threshold: ThresholdWithId;
  comparisonOptions: SelectProps.Option[];
  onDelete: () => void;
  onUpdateValue: (value: Threshold['value']) => void;
  onUpdateComparisonOperator: (value: Threshold['comparisonOperator']) => void;
  onUpdateColor: (value: Threshold['color']) => void;
}> = ({
  threshold,
  comparisonOptions,
  onDelete,
  onUpdateValue,
  onUpdateComparisonOperator,
  onUpdateColor,
}) => {
  const [validValue, updateValidValue] = useState<boolean>(true);

  // To support decimal values, the displayed value and threshold value must be different. This supports
  // input states where the decimal isn't fully typed out yet, like '33.'.
  const [displayValue, updateDisplayValue] = useState<ThresholdValue>(
    threshold.value
  );

  const { color, comparisonOperator, value } = threshold;

  const validateValue: (value: ThresholdValue) => boolean = useCallback(
    (value: ThresholdValue) => {
      const notAllowString = !OPS_ALLOWED_WITH_STRING.find(
        (op) => comparisonOperator === op
      );
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
    comparisonOptions.find(({ value = '' }) => value === comparisonOperator) ||
    comparisonOptions[0];

  const onUpdateComparator: SelectProps['onChange'] = ({ detail }) => {
    onUpdateComparisonOperator(
      detail.selectedOption.value as ComparisonOperator
    );
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
            <div
              className='threshold-configuration'
              style={{ gap: awsui.spaceScaledS }}
            >
              <Box variant='span' margin={{ top: 'l' }}>
                {defaultMessages.if}
              </Box>
              <FormField label='Operator'>
                <Select
                  expandToViewport
                  options={comparisonOptions}
                  selectedOption={selectedOption}
                  onChange={onUpdateComparator}
                  data-test-id='threshold-component-operator-select'
                />
              </FormField>
              <FormField label='Value'>
                <Input
                  value={`${displayValue}`}
                  placeholder='Threshold value'
                  onChange={onUpdateThresholdValue}
                  data-test-id='threshold-component-value-input'
                  invalid={!validValue}
                />
              </FormField>
              <Box variant='span' margin={{ top: 'l' }}>
                {defaultMessages.showAs}
              </Box>
              <Box variant='span' margin={{ top: 'l' }}>
                <ColorPicker
                  color={color || DEFAULT_THRESHOLD_COLOR}
                  updateColor={onUpdateColor}
                  data-test-id='threshold-component-color-picker'
                />
              </Box>
              <Box variant='span' margin={{ top: 'l' }}>
                <Button
                  ariaLabel='delete threshold'
                  iconName='remove'
                  variant='icon'
                  onClick={onDelete}
                  data-test-id='threshold-component-delete-button'
                />
              </Box>
            </div>
          </Box>
        </SpaceBetween>
      </div>
    </div>
  );
};

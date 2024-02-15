import React, { useEffect, useState } from 'react';

import {
  Box,
  ExpandableSection,
  FormField,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import * as awsui from '@cloudscape-design/design-tokens';

import './section.css';
import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';
import { Controller, useForm } from 'react-hook-form';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';

export const SettingsSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const { control, clearErrors } = useForm<{
    decimalPlaces: string;
  }>({ mode: 'onChange' });

  const [decimalPlacesValue, setDecimalPlacesValue] = useState<
    number | undefined
  >(significantDigits);

  const selectedWidgets = useSelectedWidgets();
  const selectedWidgetId = selectedWidgets[0]?.id;

  useEffect(() => {
    setDecimalPlacesValue(significantDigits);
    clearErrors();
  }, [clearErrors, selectedWidgetId, significantDigits]);

  const onSignificantDigitsChange = (value: string) => {
    const newValue = isNumeric(value) ? parseInt(value) || 0 : undefined;
    setDecimalPlacesValue(newValue);
    if (newValue === undefined || newValue <= 100) {
      updateSignificantDigits(newValue);
    }
  };

  return (
    <ExpandableSection
      className='accordian-header'
      headerText='Decimal places'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween size='m' direction='vertical'>
          <div
            className='settings-property-label'
            style={{ gap: awsui.spaceScaledS }}
          >
            <label htmlFor='decimal-places'>
              <b>Places</b>
            </label>
            <Controller
              control={control}
              name='decimalPlaces'
              rules={{
                max: {
                  value: 100,
                  message: 'Decimal places must be between 0 and 100.',
                },
              }}
              render={({ field, fieldState }) => (
                <FormField
                  errorText={fieldState.error?.message}
                  constraintText='Must be between 0 and 100.'
                >
                  <div className='settings-property-label-control'>
                    <Input
                      type='number'
                      data-testid='decimal-place-config'
                      controlId='decimal-places'
                      ariaLabel='decimal places'
                      value={decimalPlacesValue?.toFixed() ?? ''}
                      onKeyDown={(e) =>
                        ['-', '+'].includes(e.detail.key) && e.preventDefault()
                      }
                      onChange={({ detail: { value } }) => {
                        if (value.startsWith('-')) field.onChange(undefined);
                        else {
                          field.onChange(value);
                          onSignificantDigitsChange(value);
                        }
                      }}
                    />
                  </div>
                </FormField>
              )}
            />
          </div>
        </SpaceBetween>
      </Box>
    </ExpandableSection>
  );
};

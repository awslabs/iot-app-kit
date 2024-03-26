import React, { useEffect } from 'react';

import {
  Box,
  FormField,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';

import './section.css';

import { isNumeric } from '@iot-app-kit/core/dist/es/common/number';
import { Controller, useForm } from 'react-hook-form';
import { useSelectedWidgets } from '~/hooks/useSelectedWidgets';
import { spaceScaledS } from '@cloudscape-design/design-tokens';
import { StyledExpandableSection } from '../components/StyledExpandableSection';

export const DecimalPlacesSection = ({
  significantDigits,
  updateSignificantDigits,
}: {
  significantDigits: number | undefined;
  updateSignificantDigits: (newValue: number | undefined) => void;
}) => {
  const { control, setValue, clearErrors } = useForm<{
    decimalPlaces: string;
  }>({
    mode: 'onChange',
  });

  const selectedWidgets = useSelectedWidgets();
  const selectedWidgetId = selectedWidgets[0]?.id;

  useEffect(() => {
    //controller is using mode: 'onChange', it's not revalidating when different widget is selected
    //when user selects different widget, manually set the significantDigits and clear the error state
    setValue('decimalPlaces', significantDigits?.toFixed() || '');
    clearErrors();
  }, [clearErrors, setValue, significantDigits, selectedWidgetId]);

  const onSignificantDigitsChange = (value: string) => {
    const newValue = isNumeric(value) ? parseInt(value) || 0 : undefined;
    if (newValue === undefined || newValue <= 100) {
      updateSignificantDigits(newValue);
    }
  };

  return (
    <StyledExpandableSection
      className='accordian-header'
      headerText='Format data'
      defaultExpanded
      variant='footer'
    >
      <Box padding='s'>
        <SpaceBetween size='m' direction='vertical'>
          <div
            className='settings-property-label'
            style={{ gap: spaceScaledS }}
          >
            <label htmlFor='decimal-places'>Decimal places</label>
            <div className='settings-property-label-control'>
              <Controller
                control={control}
                name='decimalPlaces'
                rules={{
                  min: {
                    value: 0,
                    message: 'Decimal places must be between 0 and 100.',
                  },
                  max: {
                    value: 100,
                    message: 'Decimal places must be between 0 and 100.',
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormField
                    label=''
                    errorText={fieldState.error?.message}
                    constraintText='Must be between 0 and 100.'
                  >
                    <Input
                      type='number'
                      inputMode='numeric'
                      data-testid='decimal-place-config'
                      controlId='decimal-places'
                      value={field.value}
                      onChange={({ detail: { value } }) => {
                        field.onChange(value);
                        onSignificantDigitsChange(value);
                      }}
                    />
                  </FormField>
                )}
              />
            </div>
          </div>
        </SpaceBetween>
      </Box>
    </StyledExpandableSection>
  );
};

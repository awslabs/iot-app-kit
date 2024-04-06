import React, { useEffect } from 'react';
import { FormField, Input } from '@cloudscape-design/components';
import { Controller, useForm } from 'react-hook-form';
import { isNumeric } from '@iot-app-kit/core-util';

const DecimalPlaces = ({
  significantDigits,
  onChangeSignificantDigits,
  isVisible,
}: {
  significantDigits: number;
  onChangeSignificantDigits: (newValue: number) => void;
  isVisible: boolean;
}) => {
  const { control, setValue, clearErrors } = useForm<{
    decimalPlaces: string;
  }>({
    mode: 'onChange',
  });
  useEffect(() => {
    setValue('decimalPlaces', significantDigits?.toFixed());
    clearErrors();
  }, [clearErrors, setValue, significantDigits, isVisible]);

  const onSignificantDigitsChange = (value: string) => {
    const newValue = (isNumeric(value) && parseInt(value)) || 0;
    if (newValue === undefined || newValue <= 100) {
      onChangeSignificantDigits(newValue);
    }
  };

  return (
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
          label='Decimal places'
          errorText={fieldState.error?.message}
          constraintText='Must be between 0 and 100.'
        >
          <Input
            type='number'
            inputMode='numeric'
            data-testid='decimal-places-dashboard'
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
  );
};

export default DecimalPlaces;

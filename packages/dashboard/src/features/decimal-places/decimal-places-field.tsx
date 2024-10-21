import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

export const DecimalPlacesField = ({
  decimalPlaces: significantDigits,
  onChange: onSignificantDigitsChange,
  shouldClearErrors,
  showFormFieldLabel,
}: {
  decimalPlaces?: number;
  onChange: (decimalPlaces: string) => void;
  shouldClearErrors: boolean | string;
  showFormFieldLabel?: boolean;
}) => {
  const { control, setValue, clearErrors } = useForm<{
    decimalPlaces: string | undefined;
  }>({
    mode: 'onChange',
  });
  useEffect(() => {
    //controller is using mode: 'onChange', it's not revalidating when different widget is selected
    //when user selects different widget, manually set the significantDigits and clear the error state
    setValue('decimalPlaces', significantDigits?.toFixed());
    clearErrors();
  }, [clearErrors, setValue, significantDigits, shouldClearErrors]);

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
          label={showFormFieldLabel ? 'Decimal places' : ''}
          errorText={fieldState.error?.message}
          constraintText='Must be between 0 and 100.'
        >
          <Input
            type='number'
            inputMode='numeric'
            data-testid='decimal-places'
            controlId='decimal-places'
            value={field.value || ''}
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

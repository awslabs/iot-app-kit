import { useEffect } from 'react';
import { FormField, Input } from '@cloudscape-design/components';
import { Controller, useForm } from 'react-hook-form';

export const DecimalPlaces = ({
  significantDigits,
  onSignificantDigitsChange,
  shouldClearErrors,
  showFormFieldLabel,
}: {
  significantDigits?: number;
  onSignificantDigitsChange: (newValue: string) => void;
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

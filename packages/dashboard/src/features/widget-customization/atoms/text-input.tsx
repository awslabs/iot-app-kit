import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { useEffect } from 'react';
import { Controller, type ControllerProps, useForm } from 'react-hook-form';

export interface StringSettingInputFieldProps<S extends string | undefined> {
  label?: string | undefined;
  placeholderText?: string | undefined;
  descriptionText?: string | undefined;
  constraintText?: string | undefined;
  rules?: ControllerProps<{ settingValue: string }>['rules'] | undefined;
  disabled?: boolean | undefined;
  settingValue: S;
  setSettingValue: (value: S) => void;
}

export const StringSettingInputField = <S extends string | undefined>({
  label,
  placeholderText,
  descriptionText,
  constraintText,
  rules,
  disabled,
  settingValue,
  setSettingValue,
}: StringSettingInputFieldProps<S>) => {
  const { control, watch, formState } = useForm({
    values: {
      settingValue: settingValue ?? '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch(({ settingValue: updatedSettingValue }) => {
      if (formState.isValid) {
        // do not explicitly set optional string setting to an empty string to
        // avoid changing the user's dashboard configuration
        if (updatedSettingValue === '') {
          setSettingValue(undefined as S);
        } else {
          setSettingValue(updatedSettingValue as S);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, formState.isValid, setSettingValue]);

  return (
    <Controller
      control={control}
      name='settingValue'
      rules={rules}
      render={({ field, fieldState }) => (
        <FormField
          label={label}
          description={descriptionText}
          constraintText={constraintText}
          errorText={fieldState.error?.message}
        >
          <Input
            type='text'
            inputMode='text'
            placeholder={placeholderText}
            disabled={disabled}
            value={field.value}
            onChange={({ detail: { value: updatedSettingValue } }) => {
              field.onChange(updatedSettingValue);
            }}
          />
        </FormField>
      )}
    />
  );
};

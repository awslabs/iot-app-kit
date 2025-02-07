import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { Controller, type ControllerProps, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { parseIfNumber } from '~/helpers/parse-number';

export interface InputFieldProps<
  SettingValue extends string | number | undefined
> {
  type: SettingValue extends string ? 'text' : 'number';
  label?: string | undefined;
  placeholderText?: string | undefined;
  descriptionText?: string | undefined;
  constraintText?: string | undefined;
  rules?: ControllerProps<{ settingValue: string }>['rules'] | undefined;
  settingValue: SettingValue;
  setSettingValue: (value: NoInfer<SettingValue>) => void;
}

export const InputField = <SettingValue extends string | number | undefined>({
  type,
  label,
  placeholderText,
  descriptionText,
  constraintText,
  rules,
  settingValue,
  setSettingValue,
}: InputFieldProps<SettingValue>) => {
  const { control, formState, watch } = useForm({
    values: {
      settingValue: settingValue ? String(settingValue) : '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch(({ settingValue: updatedSettingValue }) => {
      if (formState.isValid) {
        if (updatedSettingValue === '') {
          setSettingValue(undefined as SettingValue);
        } else {
          setSettingValue(parseIfNumber(updatedSettingValue) as SettingValue);
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
            type={type}
            inputMode={type === 'text' ? 'text' : 'numeric'}
            placeholder={placeholderText}
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

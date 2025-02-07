import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import { useEffect } from 'react';
import { Controller, type ControllerProps, useForm } from 'react-hook-form';
import { type SetSettingValue } from '~/features/widget-customization/settings/use-widget-setting';
import { parseNumber } from '~/helpers/parse-number';

export interface NumberFieldProps<SettingValue extends number | undefined> {
  label: string;
  placeholderText?: string | undefined;
  descriptionText?: string | undefined;
  constraintText?: string | undefined;
  rules?: ControllerProps<{ settingValue: string }>['rules'] | undefined;
  settingValue: SettingValue;
  setSettingValue: SetSettingValue<SettingValue>;
}

export const NumberField = <SettingValue extends number | undefined>({
  label,
  placeholderText,
  descriptionText,
  constraintText,
  rules,
  settingValue,
  setSettingValue,
}: NumberFieldProps<SettingValue>) => {
  const { control, formState, watch } = useForm({
    values: {
      settingValue: settingValue ? String(settingValue) : '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const subscription = watch(({ settingValue: updatedSettingValue }) => {
      if (formState.isValid) {
        setSettingValue((currentSettingValue) => {
          const wasPreviouslySetByUser = currentSettingValue !== undefined;
          const isChangedByUser =
            currentSettingValue !== parseNumber(updatedSettingValue);

          if (wasPreviouslySetByUser || isChangedByUser) {
            return parseNumber(updatedSettingValue) as SettingValue;
          } else {
            return currentSettingValue;
          }
        });
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
            type='number'
            inputMode='numeric'
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

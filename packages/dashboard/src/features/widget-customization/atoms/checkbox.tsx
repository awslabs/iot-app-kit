import CloudscapeCheckbox, {
  type CheckboxProps as CloudscapeCheckboxProps,
} from '@cloudscape-design/components/checkbox';
import { useCallback } from 'react';

import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export interface CheckboxProps<SettingValue extends boolean | undefined> {
  label: string;
  settingValue: SettingValue;
  setSettingValue: SetSettingFn<SettingValue>;
}

export const Checkbox = <SettingValue extends boolean | undefined>({
  label,
  settingValue,
  setSettingValue,
}: CheckboxProps<SettingValue>) => {
  const handleChange = useCallback(
    ({
      detail: { checked: updatedSettingValue },
    }: Parameters<NonNullable<CloudscapeCheckboxProps['onChange']>>[0]) => {
      setSettingValue((currentSettingValue) => {
        const wasPreviouslySetByUser = currentSettingValue !== undefined;
        const isChangedByUser = currentSettingValue !== updatedSettingValue;

        if (wasPreviouslySetByUser || isChangedByUser) {
          console.log('toggled', updatedSettingValue);
          return updatedSettingValue as SettingValue;
        } else {
          console.log('not toggled', currentSettingValue);
          return currentSettingValue;
        }
      });
    },
    [setSettingValue]
  );

  console.log('SETTING VALUE', settingValue);

  const checked = settingValue ?? false;

  return (
    <CloudscapeCheckbox checked={checked} onChange={handleChange}>
      {label}
    </CloudscapeCheckbox>
  );
};

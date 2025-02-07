import FormField from '@cloudscape-design/components/form-field';
import { useId } from 'react';
import './color-picker.css';

import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export interface ColorPickerProps {
  label?: string | undefined;
  settingValue?: string | undefined;
  setSettingValue: SetSettingFn<string | undefined>;
}

export const ColorPicker = ({
  label,
  settingValue,
  setSettingValue,
}: ColorPickerProps) => {
  const controlId = useId();

  return (
    <FormField controlId={controlId} label={label}>
      <input
        id={controlId}
        aria-label='color picker'
        type='color'
        value={settingValue}
        onChange={(e) => {
          setSettingValue(e.target.value);
        }}
        className='color-picker'
        style={{ backgroundColor: settingValue }}
      />
    </FormField>
  );
};

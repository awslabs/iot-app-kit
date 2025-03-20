import { NumberField } from '../atoms/number-input';
import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export interface DecimalPlacesFieldProps {
  decimalPlaces?: number | undefined;
  setDecimalPlaces: SetSettingFn<number | undefined>;
}

export const DecimalPlacesField = ({
  decimalPlaces,
  setDecimalPlaces: onChange,
}: DecimalPlacesFieldProps) => {
  return (
    <NumberField
      label='Decimal places'
      constraintText='Must be between 0 and 100.'
      settingValue={decimalPlaces}
      setSettingValue={onChange}
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
    />
  );
};

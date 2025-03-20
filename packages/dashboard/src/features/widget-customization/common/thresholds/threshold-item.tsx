import Box from '@cloudscape-design/components/box';
import { type ComparisonOperator, type Threshold } from '@iot-app-kit/core';
import {
  ComparisonOperatorSelect,
  type ComparisonOperatorSelectProps,
} from './comparison-operator-field';
import { Button } from '@cloudscape-design/components';
import { ColorPicker } from '~/features/widget-customization/atoms/color-picker';
import { StringSettingInputField } from '../../atoms/text-input';
import { type SetSettingFn } from '~/features/widget-customization/settings/types';

export const DEFAULT_THRESHOLD_COLOR = '#D0021B';

export interface ThresholdItemsProps<
  SupportedOperator extends ComparisonOperator
> extends Pick<
    ComparisonOperatorSelectProps<SupportedOperator>,
    'comparisonOperator' | 'setComparisonOperator' | 'supportedOperators'
  > {
  value: Threshold['value'];
  setValue: SetSettingFn<Threshold['value']>;
  color: Threshold['color'];
  setColor: SetSettingFn<Threshold['color'] | undefined>;
  onDelete: VoidFunction;
}

export const ThresholdItem = <SupportedOperator extends ComparisonOperator>({
  comparisonOperator,
  setComparisonOperator,
  supportedOperators,
  value,
  setValue,
  color,
  setColor,
  onDelete,
}: ThresholdItemsProps<SupportedOperator>) => {
  return (
    <>
      <Box variant='span' margin={{ top: 'l' }}>
        If
      </Box>

      <ComparisonOperatorSelect<SupportedOperator>
        comparisonOperator={comparisonOperator}
        setComparisonOperator={setComparisonOperator}
        supportedOperators={supportedOperators}
      />

      <StringSettingInputField
        label='Value'
        placeholderText='Threshold value'
        settingValue={String(value)}
        setSettingValue={(thresholdValue) => setValue(thresholdValue)}
      />

      <Box variant='span' margin={{ top: 'l' }}>
        show as
      </Box>

      <Box variant='span' margin={{ top: 'l' }}>
        <ColorPicker
          settingValue={color || DEFAULT_THRESHOLD_COLOR}
          setSettingValue={setColor}
          data-test-id='threshold-component-color-picker'
        />
      </Box>

      <Box variant='span' margin={{ top: 'l' }}>
        <Button
          ariaLabel='delete threshold'
          iconName='remove'
          variant='icon'
          onClick={onDelete}
          data-test-id='threshold-component-delete-button'
        />
      </Box>
    </>
  );
};

import CloudscapeSelect, {
  type SelectProps as CloudscapeSelectProps,
} from '@cloudscape-design/components/select';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { type SetSettingValue } from '~/features/widget-customization/settings/use-widget-setting';

export interface SelectOption<Value> {
  value: Value;
  text: string;
}

export interface OnSelect<SettingValue> {
  (option: SelectOption<SettingValue>): void;
}

export interface SelectProps<SettingValue> {
  options: readonly SelectOption<SettingValue>[];
  settingValue: SettingValue;
  setSettingValue: SetSettingValue<SettingValue>;
}

export function Select<const Value>({
  options,
  settingValue,
  setSettingValue,
}: SelectProps<Value>) {
  const cloudscapeOptions = useMemo(
    () => options.map(toCloudscapeOption),
    [options]
  );

  const selectedOption = useMemo(() => {
    const found = options.find((option) => option.value === settingValue);

    invariant(
      found,
      `Expected to find option associated with the value: ${settingValue}.`
    );

    return toCloudscapeOption(found);
  }, [settingValue, options]);

  const handleSelect = useCallback(
    ({
      detail: {
        selectedOption: { label: text, value },
      },
    }: Parameters<NonNullable<CloudscapeSelectProps['onChange']>>[0]) => {
      // these values are not optional in our definition of `options`
      invariant(text, 'Text must be defined.');
      invariant(value, 'Value must be defined.');
      // casting is done to narrow the Cloudscape string type
      setSettingValue(value as Value);
    },
    [setSettingValue]
  );

  return (
    <CloudscapeSelect
      options={cloudscapeOptions}
      selectedOption={selectedOption}
      onChange={handleSelect}
    />
  );
}

type CloudscapeOption = NonNullable<CloudscapeSelectProps['options']>[number];

function toCloudscapeOption<Value>({
  text,
  value,
}: SelectOption<Value>): CloudscapeOption {
  return { label: text, value: String(value ?? '') };
}

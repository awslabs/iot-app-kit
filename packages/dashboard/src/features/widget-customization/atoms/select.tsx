import CloudscapeSelect, {
  type SelectProps as CloudscapeSelectProps,
} from '@cloudscape-design/components/select';
import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { type SetSettingFn } from '~/features/widget-customization/settings/types';
import { compact } from '../../../helpers/lists/compact';

export interface SelectOption<Value> {
  value: Value;
  text: string;
}

export interface SelectProps<SettingValue> {
  options: readonly SelectOption<SettingValue>[];
  settingValue: SettingValue;
  setSettingValue: SetSettingFn<SettingValue>;
}

export function Select<const Value>({
  options,
  settingValue,
  setSettingValue,
}: SelectProps<Value>) {
  const cloudscapeOptions = useMemo(
    () => compact(options.map(toCloudscapeOption)),
    [options]
  );

  const selectedOption = useMemo(() => {
    const found = options.find((option) => option.value === settingValue);
    console.info('value', settingValue);
    console.info('Options ', options);
    console.info(`Found ${found}`);

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

function toCloudscapeOption<Value>(
  option: SelectOption<Value> | undefined
): CloudscapeOption | null {
  return option
    ? { label: option.text, value: String(option.value ?? '') }
    : null;
}

import { type ReactNode } from 'react';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import type {
  SetWidgetSetting,
  WidgetSetting,
  WidgetSettingPath,
} from '~/features/widget-customization/settings/types';
import { useWidgetSetting } from '~/features/widget-customization/settings/use-widget-setting';

export type WidgetSettingProps<
  WidgetType extends RegisteredWidgetType,
  SettingPath extends WidgetSettingPath<WidgetType>
> = {
  widget: WidgetInstance<WidgetType>;
  settingPath: SettingPath;
  render: (result: {
    settingValue: WidgetSetting<WidgetType, SettingPath>;
    setSettingValue: SetWidgetSetting<WidgetType, SettingPath>;
  }) => ReactNode;
};

export function WidgetSetting<
  const WidgetType extends RegisteredWidgetType,
  const SettingPath extends WidgetSettingPath<WidgetType>
>({
  widget,
  settingPath,
  render,
}: WidgetSettingProps<WidgetType, SettingPath>): ReactNode {
  const [settingValue, setSettingValue] = useWidgetSetting(widget, settingPath);

  return render({ settingValue, setSettingValue } as const);
}

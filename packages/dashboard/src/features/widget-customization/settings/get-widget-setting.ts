import get from 'lodash-es/get';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';
import type {
  WidgetSetting,
  WidgetSettingPath,
} from '~/features/widget-customization/settings/types';

export function getWidgetSetting<
  const WidgetType extends RegisteredWidgetType,
  const SettingPath extends WidgetSettingPath<WidgetType>
>(
  widget: WidgetInstance<WidgetType>,
  settingPath: SettingPath
): WidgetSetting<WidgetType, SettingPath> {
  return get(widget, settingPath) as WidgetSetting<WidgetType, SettingPath>;
}

import type { Get, Paths } from 'type-fest';
import { type RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export type WidgetSettingPath<
  WidgetType extends RegisteredWidgetType = RegisteredWidgetType
> = Paths<WidgetInstance<WidgetType>>;

export type WidgetSetting<
  Type extends RegisteredWidgetType,
  Path extends WidgetSettingPath<Type>
> = Get<WidgetInstance<Type>, Path>;

export type SetSettingFn<SettingValue> = (
  update: ((current: SettingValue) => SettingValue) | SettingValue
) => void;

export type SetWidgetSetting<
  WidgetType extends RegisteredWidgetType,
  SettingPath extends WidgetSettingPath<WidgetType>
> = SetSettingFn<WidgetSetting<WidgetType, SettingPath>>;

export type HasWidgetSetting<
  Type extends RegisteredWidgetType,
  Path extends WidgetSettingPath
> = Path extends WidgetSettingPath<Type> ? true : false;

export type RegisteredWidgetTypeWithSetting<
  SettingPath extends WidgetSettingPath
> = {
  [WidgetType in RegisteredWidgetType]: HasWidgetSetting<
    WidgetType,
    SettingPath
  > extends true
    ? WidgetType
    : never;
}[RegisteredWidgetType];

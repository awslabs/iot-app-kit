import type { ComponentType, JSXElementConstructor } from 'react';
import type { RegisteredWidgetType } from '~/features/widget-plugins/registry';
import { type WidgetInstance } from '~/features/widget-instance/instance';

export interface WidgetComponentProps<WidgetType extends RegisteredWidgetType> {
  widget: WidgetInstance<WidgetType>;
}

export type WidgetComponent<WidgetType extends RegisteredWidgetType> =
  ComponentType<WidgetComponentProps<WidgetType>>;

export interface SettingsComponentProps<
  WidgetType extends RegisteredWidgetType
> {
  widget: WidgetInstance<WidgetType>;
}

export type StyleSettingsComponentProps<
  WidgetType extends RegisteredWidgetType
> = SettingsComponentProps<WidgetType>;

export type StyleSettingsComponent<Type extends RegisteredWidgetType> =
  JSXElementConstructor<StyleSettingsComponentProps<Type>>;

export type DataStreamSettingsComponentProps<
  WidgetType extends RegisteredWidgetType
> = SettingsComponentProps<WidgetType>;

export type DataStreamSettingsComponent<Type extends RegisteredWidgetType> =
  JSXElementConstructor<DataStreamSettingsComponentProps<Type>>;

export type ThresholdSettingsComponentProps<
  WidgetType extends RegisteredWidgetType
> = SettingsComponentProps<WidgetType>;

export type ThresholdSettingsComponent<Type extends RegisteredWidgetType> =
  JSXElementConstructor<ThresholdSettingsComponentProps<Type>>;

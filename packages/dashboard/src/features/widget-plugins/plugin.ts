import type {
  DataStreamSettingsComponent,
  StyleSettingsComponent,
  ThresholdSettingsComponent,
  WidgetComponent,
} from '~/features/widget-customization/types';
import type {
  RegisteredWidgetPlugins,
  RegisteredWidgetType,
} from '~/features/widget-plugins/registry';
import type { FunctionComponent, SVGAttributes } from 'react';

export type SVGIcon = FunctionComponent<SVGAttributes<SVGElement>>;

export interface PluginConfiguration<WidgetType extends RegisteredWidgetType> {
  type: WidgetType;
  name: string;
  icon: {
    light: SVGIcon;
    dark: SVGIcon;
  };
  component: WidgetComponent<WidgetType>;
  initialProperties: RegisteredWidgetPlugins[WidgetType]['properties'];
  initialSize: {
    height: number;
    width: number;
  };
}

export class Plugin<
  WidgetType extends RegisteredWidgetType = RegisteredWidgetType
> {
  readonly #definition: PluginConfiguration<WidgetType>;
  #styleSettingsComponent: StyleSettingsComponent<WidgetType> | undefined;
  #dataStreamSettingsComponent:
    | DataStreamSettingsComponent<WidgetType>
    | undefined;
  #thresholdSettingsComponent:
    | ThresholdSettingsComponent<WidgetType>
    | undefined;

  constructor(definition: PluginConfiguration<WidgetType>) {
    this.#definition = definition;
  }

  public get configuration(): PluginConfiguration<WidgetType> {
    return this.#definition;
  }

  public get StyleSettingsComponent() {
    return this.#styleSettingsComponent;
  }

  public get DataStreamSettingsComponent() {
    return this.#dataStreamSettingsComponent;
  }

  public get ThresholdSettingsComponent() {
    return this.#thresholdSettingsComponent;
  }

  public setStyleSettingsComponent(
    styleSettingsComponent: StyleSettingsComponent<WidgetType>
  ) {
    this.#styleSettingsComponent = styleSettingsComponent;
    return this;
  }

  public setDataStreamSettingsComponent(
    dataStreamSettingsComponent: DataStreamSettingsComponent<WidgetType>
  ) {
    this.#dataStreamSettingsComponent = dataStreamSettingsComponent;
    return this;
  }

  public setThresholdSettingsComponent(
    thresholdSettingsComponent: ThresholdSettingsComponent<WidgetType>
  ) {
    this.#thresholdSettingsComponent = thresholdSettingsComponent;
    return this;
  }
}

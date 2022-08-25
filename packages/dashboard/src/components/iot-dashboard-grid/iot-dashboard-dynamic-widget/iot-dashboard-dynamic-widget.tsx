import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { Component, Prop, h } from '@stencil/core';
import {
  Annotations,
  LabelsConfig,
  Trend,
  MovementConfig,
  ScaleConfig,
  LayoutConfig,
  Axis,
  LegendConfig,
  ChartConfig,
  AlarmsConfig,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
} from '@synchro-charts/core';

import xIcon from './icon-x.svg';

interface DynamicWidgetProps extends ChartConfig {
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  trends?: Trend[];
  alarms?: AlarmsConfig;
  labelsConfig?: LabelsConfig;
  gestures?: boolean;
}

@Component({
  tag: 'iot-dashboard-dynamic-widget',
  styleUrl: 'iot-dashboard-dynamic-widget.css',
})
export class IotDynamicWidget implements ChartConfig {
  @Prop() componentTag!: string;

  @Prop() widgetId!: string;
  @Prop() viewport: MinimalViewPortConfig;
  @Prop() queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() legend?: LegendConfig;
  @Prop() annotations?: Annotations;
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;
  @Prop() size?: MinimalSizeConfig;
  @Prop() trends?: Trend[];
  @Prop() alarms?: AlarmsConfig;
  @Prop() gestures?: boolean;
  @Prop() labelsConfig?: LabelsConfig;

  @Prop() readOnly?: boolean;
  @Prop() isEditing?: boolean;

  /** Error Messaging */
  @Prop() invalidTagErrorHeader!: string;
  @Prop() invalidTagErrorSubheader!: string;

  // A set of all componentTags which have caused errors.
  // We want to keep track so that we don't call many errors for the same component tag.
  private erroredTags: Set<string> = new Set();

  doesComponentExist = (): boolean => {
    const componentIsRegistered = customElements.get(this.componentTag) != null;
    if (!componentIsRegistered && !this.erroredTags.has(this.componentTag)) {
      this.erroredTags.add(this.componentTag);

      // NOTE: If this occurs, this means something went wrong - either
      //       an incorrect `componentTag` was passed in or a web component is failing to be registered.

      // eslint-disable-next-line no-console
      console.warn(
        `Attempting to register a web component "${this.componentTag}", which is not a registered web component.`
      );
    }

    return componentIsRegistered;
  };

  render() {
    if (!this.doesComponentExist()) {
      // If the component is not registered, when we attempt to mount the web component, it will simply
      // render nothing at all. So instead we want to inform the user to help troubleshoot.
      return (
        <div class="error-container">
          <div>
            <img src={xIcon} alt="warning - widget failed" />
            <br />
            <h1>{this.invalidTagErrorHeader}</h1>
            <br />
            <h2>{this.invalidTagErrorSubheader}</h2>
          </div>
        </div>
      );
    }

    const props: DynamicWidgetProps = {
      widgetId: this.widgetId,
      queries: this.queries,
      viewport: this.viewport,
      movement: this.movement,
      scale: this.scale,
      layout: this.layout,
      legend: this.legend,
      annotations: this.annotations,
      axis: this.axis,
      messageOverrides: this.messageOverrides,
      size: this.size,
      trends: this.trends,
      alarms: this.alarms,
      labelsConfig: this.labelsConfig,
      gestures: this.gestures,
    };

    return <this.componentTag {...props} />;
  }
}

import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, TimeSeriesDataRequestSettings, StyleSettingsMap } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-bar-chart',
  shadow: false,
})
export class IotBarChart {
  @Prop() appKit: DataModule;

  @Prop() queries: AnyDataStreamQuery[];

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() settings: TimeSeriesDataRequestSettings | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  getSettings(): TimeSeriesDataRequestSettings {
    return {
      ...this.settings,
      fetchFromStartToEnd: true,
    };
  }

  render() {
    const settings = this.getSettings();
    return (
      <iot-connector
        appKit={this.appKit}
        queries={this.queries}
        styleSettings={this.styleSettings}
        request={{
          settings,
          viewport: this.viewport,
        }}
        renderFunc={({ dataStreams }) => (
          <sc-bar-chart
            dataStreams={dataStreams}
            viewport={this.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

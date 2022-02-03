import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { StyleSettingsMap, Query, DataStreamCallback } from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-line-chart-demo',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: any; // AppKit session and module coordinator to be introduced

  @Prop() query: Query<DataStreamCallback>;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  render() {
    return (
      <iot-time-series-data-connector
        provider={this.query.build(this.appKit.session, { viewport: this.viewport })}
        styleSettings={this.styleSettings}
        renderFunc={({ timeSeriesData }) => (
          <sc-line-chart
            dataStreams={timeSeriesData.streams}
            viewport={this.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

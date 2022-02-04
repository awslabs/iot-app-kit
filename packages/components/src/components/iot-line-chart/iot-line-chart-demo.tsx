import { Component, Prop, h, State } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  Query,
  DataStreamCallback,
  DataModuleSubscription,
  AnyDataStreamQuery,
} from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../iot-connector/bindStylesToDataStreams';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-line-chart-demo',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: any; // AppKit session and module coordinator to be introduced

  @Prop() query: Query<DataModuleSubscription<AnyDataStreamQuery>, DataStreamCallback>;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  render() {
    return (
      <iot-time-series-data-connector
        session={this.appKit.session(this.widgetId)}
        query={this.query}
        renderFunc={({ dataStreams }) => (
          <sc-line-chart
            dataStreams={bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings })}
            viewport={this.query.params.request.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

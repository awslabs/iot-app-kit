import { Component, Prop, h, State, Watch, Listen } from '@stencil/core';
import {
  StyleSettingsMap,
  Query,
  DataStreamCallback,
  DataModuleSubscription,
  AnyDataStreamQuery,
  SubscriptionUpdate,
  Provider,
} from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../iot-connector/bindStylesToDataStreams';

@Component({
  tag: 'iot-line-chart-demo',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: any; // AppKit session and module coordinator to be introduced

  @Prop() query: Query<
    DataModuleSubscription<AnyDataStreamQuery>,
    SubscriptionUpdate<AnyDataStreamQuery>,
    DataStreamCallback
  >;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: Provider<SubscriptionUpdate<AnyDataStreamQuery>, DataStreamCallback>;

  componentWillLoad() {
    this.provider = this.query.build(this.appKit.session(this.widgetId));
  }

  @Watch('query')
  private onUpdateProp(newProp: unknown, oldProp: unknown) {
    this.provider = this.query.build(this.appKit.session(this.widgetId));
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    // this.provider.updateViewport()
  }

  render() {
    return (
      <iot-time-series-data-connector
        provider={this.provider}
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

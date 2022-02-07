import { Component, Prop, h, State, Watch, Listen } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  DataStreamCallback,
  DataModuleSubscription,
  AnyDataStreamQuery,
  SubscriptionUpdate,
  Query,
  SiteWiseTimeSeriesDataProvider,
} from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../iot-connector/bindStylesToDataStreams';

@Component({
  tag: 'iot-line-chart-demo',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: any; // IotAppKit

  @Prop() query: Query<
    DataModuleSubscription<AnyDataStreamQuery>,
    SubscriptionUpdate<AnyDataStreamQuery>,
    DataStreamCallback
  >;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  componentWillLoad() {
    this.provider = this.query.build(this.appKit.session(this.widgetId));
  }

  @Watch('query')
  private onUpdateProp(newProp: unknown, oldProp: unknown) {
    // check that this.query returns new query
    this.provider = this.query.build(this.appKit.session(this.widgetId));
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    this.provider.updateViewport({ start, end, lastUpdatedBy });
  }

  render() {
    return (
      <iot-time-series-data-connector
        provider={this.provider}
        renderFunc={({ dataStreams }) => (
          <sc-line-chart
            dataStreams={
              bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings }) as SynchroChartsDataStream[]
            }
            viewport={this.provider.getViewport()}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

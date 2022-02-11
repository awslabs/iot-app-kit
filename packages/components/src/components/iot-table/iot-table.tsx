import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  SiteWiseTimeSeriesDataProvider,
  IoTAppKit,
  TimeSeriesQuery,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() appKit: IoTAppKit;

  @Prop() query: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;

  @Prop() widgetId: string;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchMostRecentBeforeEnd: true,
  };

  componentWillLoad() {
    this.provider = this.query.build(this.appKit.session(this.widgetId), this.defaultSettings);
  }

  @Watch('query')
  private onQueryUpdate() {
    this.provider = this.query.build(this.appKit.session(this.widgetId), this.defaultSettings);
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    this.provider.updateViewport({ start, end, lastUpdatedBy });
  }

  render() {
    return (
      <iot-time-series-connector
        provider={this.provider}
        styleSettings={this.styleSettings}
        renderFunc={({ dataStreams }) => (
          <sc-table
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            viewport={this.provider.input.request.viewport}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

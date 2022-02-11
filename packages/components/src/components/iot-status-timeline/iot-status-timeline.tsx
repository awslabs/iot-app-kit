import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  SiteWiseTimeSeriesDataProvider,
  IoTAppKit,
  TimeSeriesQuery,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-status-timeline',
  shadow: false,
})
export class IotStatusTimeline {
  @Prop() appKit: IoTAppKit;

  @Prop() query: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchMostRecentBeforeStart: true,
    fetchFromStartToEnd: true,
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
          <sc-status-timeline
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            viewport={this.provider.input.request.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

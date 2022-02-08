import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  IoTAppKit,
  SiteWiseTimeSeriesDataProvider,
  TimeSeriesQuery,
  TimeSeriesDataRequestSettings,
} from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';

@Component({
  tag: 'iot-line-chart',
  shadow: false,
})
export class IotLineChart {
  @Prop() appKit: IoTAppKit;

  @Prop() query: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchFromStartToEnd: true,
    fetchMostRecentBeforeStart: true,
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
        renderFunc={({ dataStreams, viewport }) => {
          return (
            <sc-line-chart
              dataStreams={
                bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings }) as SynchroChartsDataStream[]
              }
              viewport={viewport}
              isEditing={this.isEditing}
              widgetId={this.widgetId}
            />
          );
        }}
      />
    );
  }
}

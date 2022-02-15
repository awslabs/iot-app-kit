import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { DataStream as SynchroChartsDataStream, MinimalViewPortConfig } from '@synchro-charts/core';
import {
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
  SiteWiseTimeSeriesDataProvider,
  IoTAppKit,
  TimeSeriesQuery,
  composeSiteWiseProviders,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-bar-chart',
  shadow: false,
})
export class IotBarChart {
  @Prop() appKit!: IoTAppKit;

  @Prop() queries!: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>[];

  @Prop() viewport!: MinimalViewPortConfig;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchFromStartToEnd: true,
  };

  buildProvider() {
    this.provider = composeSiteWiseProviders(
      this.queries.map((query) =>
        query.build(this.appKit.session(this.widgetId), {
          viewport: this.viewport,
          settings: {
            ...this.defaultSettings,
            ...this.settings,
          },
        })
      )
    );
  }

  componentWillLoad() {
    this.buildProvider();
  }

  @Watch('queries')
  @Watch('settings')
  @Watch('viewport')
  private onPropUpdate() {
    this.buildProvider();
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
          <sc-bar-chart
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

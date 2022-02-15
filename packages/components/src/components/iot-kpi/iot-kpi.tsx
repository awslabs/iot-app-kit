import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { DataStream as SynchroChartsDataStream, MinimalViewPortConfig } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  SiteWiseTimeSeriesDataProvider,
  IoTAppKit,
  TimeSeriesQuery,
  TimeSeriesDataRequestSettings,
  composeSiteWiseProviders,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-kpi',
  shadow: false,
})
export class IotKpi {
  @Prop() appKit!: IoTAppKit;

  @Prop() queries!: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>[];

  @Prop() viewport!: MinimalViewPortConfig;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchMostRecentBeforeEnd: true,
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
          <sc-kpi
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

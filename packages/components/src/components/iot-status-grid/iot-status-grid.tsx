import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { Annotations, DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import uuid from 'uuid';

@Component({
  tag: 'iot-status-grid',
  shadow: false,
})
export class IotStatusGrid {
  @Prop() annotations: Annotations;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuid.v4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    resolution: '0',
    fetchMostRecentBeforeEnd: true,
  };

  buildProvider() {
    this.provider = combineProviders(
      this.queries.map((query) =>
        query.build(this.widgetId, {
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
    this.provider.unsubscribe();
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
          <sc-status-grid
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            annotations={this.annotations}
            viewport={this.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

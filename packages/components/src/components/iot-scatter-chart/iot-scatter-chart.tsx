import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { Annotations, DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  TimeQuery,
  Viewport,
  TimeSeriesData,
  TimeSeriesDataRequest,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import uuid from 'uuid';

@Component({
  tag: 'iot-scatter-chart',
  shadow: false,
})
export class IotScatterChart {
  @Prop() annotations: Annotations;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuid.v4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchFromStartToEnd: true,
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
        assignDefaultColors
        renderFunc={({ dataStreams }) => {
          return (
            <sc-scatter-chart
              dataStreams={dataStreams as SynchroChartsDataStream[]}
              annotations={this.annotations}
              viewport={this.viewport}
              isEditing={this.isEditing}
              widgetId={this.widgetId}
            />
          );
        }}
      />
    );
  }
}

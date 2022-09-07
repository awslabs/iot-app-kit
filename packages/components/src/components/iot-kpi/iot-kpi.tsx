import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { Annotations, DataStream as SynchroChartsDataStream, MessageOverrides } from '@synchro-charts/core';
import {
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  combineProviders,
  TimeQuery,
  TimeSeriesData,
  Viewport,
  TimeSeriesDataRequest,
  ProviderWithViewport,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  tag: 'iot-kpi',
  shadow: false,
})
export class IotKpi {
  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() annotations: Annotations;

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  @Prop() messageOverrides?: MessageOverrides;

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
        annotations={this.annotations}
        renderFunc={({ dataStreams, annotations }) => (
          <sc-kpi
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            annotations={annotations}
            viewport={this.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
            messageOverrides={this.messageOverrides}
          />
        )}
      />
    );
  }
}

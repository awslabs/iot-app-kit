import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import {
  DataStream as SynchroChartsDataStream,
  Annotations as SynchroChartsAnnotations,
  MessageOverrides,
} from '@synchro-charts/core';
import {
  StyleSettingsMap,
  Annotations,
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
  private onPropUpdate() {
    this.buildProvider();
  }

  @Watch('viewport')
  private onViewportUpdate() {
    this.provider.updateViewport(this.viewport);
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end] }: { detail: [Date, Date] }) {
    this.provider.updateViewport({ start, end });
  }

  render() {
    return (
      <iot-time-series-connector
        initialViewport={this.viewport}
        provider={this.provider}
        styleSettings={this.styleSettings}
        annotations={this.annotations}
        supportedDataTypes={['NUMBER', 'STRING', 'BOOLEAN']}
        renderFunc={({ dataStreams, annotations, viewport }) => (
          <sc-kpi
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            annotations={annotations as SynchroChartsAnnotations}
            viewport={viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
            messageOverrides={this.messageOverrides}
          />
        )}
      />
    );
  }
}

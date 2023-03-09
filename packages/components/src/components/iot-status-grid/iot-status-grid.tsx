import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import {
  DataStream as SynchroChartsDataStream,
  Annotations as SynchroChartsAnnotations,
  LabelsConfig,
} from '@synchro-charts/core';
import {
  StyleSettingsMap,
  Annotations,
  TimeSeriesDataRequestSettings,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  tag: 'iot-status-grid',
  shadow: false,
})
export class IotStatusGrid {
  @Prop() annotations: Annotations;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  @Prop() labelsConfig: LabelsConfig;

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
          <sc-status-grid
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            annotations={annotations as SynchroChartsAnnotations}
            viewport={viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
            labelsConfig={this.labelsConfig}
          />
        )}
      />
    );
  }
}

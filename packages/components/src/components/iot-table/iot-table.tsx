import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import {
  Annotations,
  DataStream as SynchroChartsDataStream,
  MessageOverrides,
  TableColumn,
  Trend,
} from '@synchro-charts/core';
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
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() annotations: Annotations;

  @Prop() messageOverrides?: MessageOverrides;

  @Prop() trends: Trend[];

  @Prop() tableColumns: TableColumn[];

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() enableAudioAlerts = false;

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
        annotations={this.annotations}
        provider={this.provider}
        styleSettings={this.styleSettings}
        enableAudioAlerts={this.enableAudioAlerts}
        renderFunc={({ dataStreams }) => (
          <sc-table
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            tableColumns={this.tableColumns}
            annotations={this.annotations}
            viewport={this.viewport}
            widgetId={this.widgetId}
            messageOverrides={this.messageOverrides}
            trends={this.trends}
          />
        )}
      />
    );
  }
}

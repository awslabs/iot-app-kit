import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import {
  Axis,
  DataStream as SynchroChartsDataStream,
  LayoutConfig,
  Annotations as SynchroChartsAnnotations,
  LegendConfig,
  MessageOverrides,
  MinimalSizeConfig,
  MovementConfig,
  ScaleConfig,
  Trend,
} from '@synchro-charts/core';
import {
  Annotations,
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  combineProviders,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
  ProviderWithViewport,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  tag: 'iot-line-chart',
  shadow: false,
})
export class IotLineChart {
  @Prop() widgetId: string = uuidv4();
  @Prop() viewport!: Viewport;
  @Prop() size?: MinimalSizeConfig;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() legend?: LegendConfig;
  @Prop() annotations: Annotations;
  @Prop() axis: Axis.Options;
  @Prop() messageOverrides: MessageOverrides;
  @Prop() trends: Trend[];

  @Prop() gestures?: boolean;
  @Prop() isEditing: boolean | undefined;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchFromStartToEnd: true,
    fetchMostRecentBeforeStart: true,
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
        assignDefaultColors
        annotations={this.annotations}
        supportedDataTypes={['NUMBER']}
        renderFunc={({ dataStreams, annotations, viewport }) => {
          return (
            <sc-line-chart
              widgetId={this.widgetId}
              viewport={viewport}
              size={this.size}
              movement={this.movement}
              scale={this.scale}
              layout={this.layout}
              legend={this.legend}
              gestures={this.gestures}
              dataStreams={dataStreams as SynchroChartsDataStream[]}
              annotations={annotations as SynchroChartsAnnotations}
              isEditing={this.isEditing}
              trends={this.trends}
              messageOverrides={this.messageOverrides}
              axis={this.axis}
            />
          );
        }}
      />
    );
  }
}

import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import {
  AlarmsConfig,
  Axis,
  DataStream as SynchroChartsDataStream,
  Annotations as SynchroChartsAnnotations,
  LayoutConfig,
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
  TimeQuery,
  Viewport,
  TimeSeriesData,
  TimeSeriesDataRequest,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  tag: 'iot-scatter-chart',
  shadow: false,
})
export class IotScatterChart {
  @Prop() annotations: Annotations;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() legend?: LegendConfig;
  @Prop() size?: MinimalSizeConfig;
  @Prop() alarms?: AlarmsConfig;
  @Prop() gestures?: boolean;
  @Prop() trends: Trend[];
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

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
            <sc-scatter-chart
              dataStreams={dataStreams as SynchroChartsDataStream[]}
              annotations={annotations as SynchroChartsAnnotations}
              viewport={viewport}
              isEditing={this.isEditing}
              widgetId={this.widgetId}
              movement={this.movement}
              scale={this.scale}
              layout={this.layout}
              legend={this.legend}
              size={this.size}
              alarms={this.alarms}
              gestures={this.gestures}
              trends={this.trends}
              axis={this.axis}
              messageOverrides={this.messageOverrides}
            />
          );
        }}
      />
    );
  }
}

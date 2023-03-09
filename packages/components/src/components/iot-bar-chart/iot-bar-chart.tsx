import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { v4 as uuidv4 } from 'uuid';
import {
  AlarmsConfig,
  Axis,
  Annotations as SynchroChartsAnnotations,
  DataStream as SynchroChartsDataStream,
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
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
  TimeQuery,
  combineProviders,
  Viewport,
  ProviderWithViewport,
  TimeSeriesData,
  TimeSeriesDataRequest,
} from '@iot-app-kit/core';

const HOUR_IN_MS = 1000 * 60 * 60;
const DAY_IN_MS = HOUR_IN_MS * 24;

@Component({
  tag: 'iot-bar-chart',
  shadow: false,
})
export class IotBarChart {
  @Prop() viewport!: Viewport;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() legend?: LegendConfig;
  @Prop() size?: MinimalSizeConfig;
  @Prop() widgetId: string = uuidv4();
  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  @Prop() alarms?: AlarmsConfig;
  @Prop() gestures?: boolean;
  @Prop() annotations: Annotations;
  @Prop() trends: Trend[];
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    fetchFromStartToEnd: true,
    resolution: {
      [0]: '1m',
      [HOUR_IN_MS]: '1hr',
      [DAY_IN_MS * 5]: '1day',
    },
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
        renderFunc={({ dataStreams, annotations, viewport }) => (
          <sc-bar-chart
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
        )}
      />
    );
  }
}

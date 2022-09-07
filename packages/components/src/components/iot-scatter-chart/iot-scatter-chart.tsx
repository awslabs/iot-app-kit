import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import {
  AlarmsConfig,
  Annotations,
  Axis,
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
        annotations={this.annotations}
        renderFunc={({ dataStreams, annotations }) => {
          return (
            <sc-scatter-chart
              dataStreams={dataStreams as SynchroChartsDataStream[]}
              annotations={annotations}
              viewport={this.viewport}
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

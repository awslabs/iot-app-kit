import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import { v4 as uuidv4 } from 'uuid';
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

  @Prop() enableAudioAlerts = false;

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
        assignDefaultColors
        enableAudioAlerts={this.enableAudioAlerts}
        renderFunc={({ dataStreams }) => (
          <sc-bar-chart
            widgetId={this.widgetId}
            viewport={this.viewport}
            size={this.size}
            movement={this.movement}
            scale={this.scale}
            layout={this.layout}
            legend={this.legend}
            gestures={this.gestures}
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            annotations={this.annotations}
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

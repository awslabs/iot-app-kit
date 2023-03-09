import { Component, Prop, h, Listen, State, Watch } from '@stencil/core';
import {
  AlarmsConfig,
  Axis,
  Annotations as SynchroChartsAnnotations,
  DataStream as SynchroChartsDataStream,
  LayoutConfig,
  MessageOverrides,
  MinimalSizeConfig,
  MovementConfig,
  ScaleConfig,
} from '@synchro-charts/core';
import {
  Annotations,
  StyleSettingsMap,
  TimeSeriesDataRequestSettings,
  TimeQuery,
  TimeSeriesData,
  Viewport,
  TimeSeriesDataRequest,
  ProviderWithViewport,
  combineProviders,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { combineAnnotations } from '../common/combineAnnotations';
import { getAlarmStreamAnnotations } from '../common/getAlarmStreamAnnotations';

@Component({
  tag: 'iot-status-timeline',
  shadow: false,
})
export class IotStatusTimeline {
  @Prop() annotations?: Annotations;
  @Prop() axis?: Axis.Options;
  @Prop() messageOverrides?: MessageOverrides;
  @Prop() alarms?: AlarmsConfig;
  @Prop() gestures?: boolean;
  @Prop() movement?: MovementConfig;
  @Prop() scale?: ScaleConfig;
  @Prop() layout?: LayoutConfig;
  @Prop() size?: MinimalSizeConfig;

  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() viewport!: Viewport;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  private defaultSettings: TimeSeriesDataRequestSettings = {
    resolution: '0',
    fetchMostRecentBeforeStart: true,
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
        supportedDataTypes={['NUMBER', 'STRING', 'BOOLEAN']}
        renderFunc={({ dataStreams, annotations, viewport }) => {
          const alarmStreamAnnotations = getAlarmStreamAnnotations({ annotations, dataStreams });
          const combinedAnnotations = combineAnnotations(this.annotations, alarmStreamAnnotations);

          return (
            <sc-status-timeline
              dataStreams={dataStreams as SynchroChartsDataStream[]}
              annotations={combinedAnnotations as SynchroChartsAnnotations}
              viewport={viewport}
              isEditing={this.isEditing}
              widgetId={this.widgetId}
              gestures={this.gestures}
              movement={this.movement}
              scale={this.scale}
              layout={this.layout}
              size={this.size}
              axis={this.axis}
              messageOverrides={this.messageOverrides}
              alarms={this.alarms}
            />
          );
        }}
      />
    );
  }
}

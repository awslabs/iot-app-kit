import { Component, Prop, h, State, Listen, Watch } from '@stencil/core';
import { Annotations, DataStream, ViewPortConfig } from '@synchro-charts/core';
import {
  TimeSeriesDataRequestSettings,
  combineProviders,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  ProviderWithViewport,
} from '@iot-app-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { DialStyleSettingsMap, DIAL_SIZE_CONFIG, SizeStyle } from './utils';
import { DialMessages, RecursivePartial } from '@synchro-charts/core/dist/types/components/sc-dial/type';

@Component({
  tag: 'iot-dial',
  shadow: false,
})
export class IotDial {
  @Prop() queries!: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];

  @Prop() annotations: Annotations;

  @Prop() size: SizeStyle;

  @Prop() viewport!: ViewPortConfig;

  @Prop() settings: TimeSeriesDataRequestSettings = {};

  @Prop() widgetId: string = uuidv4();

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: DialStyleSettingsMap | undefined;

  @Prop() significantDigits?: number;

  @State() provider: ProviderWithViewport<TimeSeriesData[]>;

  @Prop() messageOverrides?: RecursivePartial<DialMessages>;

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
        renderFunc={({ dataStreams }) =>
          dataStreams.map((dataStream) => {
            const yMin = (this.styleSettings?.yMin || this.viewport.yMin) as number;
            const yMax = (this.styleSettings?.yMax || this.viewport.yMax) as number;
            console.log(JSON.stringify(dataStream), 'datastream');
            return (
              <sc-dial
                key={dataStream.id}
                dataStream={dataStream as DataStream}
                associatedStreams={dataStream.associatedStreams}
                annotations={this.annotations}
                viewport={{ ...this.viewport, yMin, yMax }}
                widgetId={this.widgetId}
                size={DIAL_SIZE_CONFIG[this.size]}
                significantDigits={this.significantDigits}
                messageOverrides={this.messageOverrides}
              />
            );
          })
        }
      />
    );
  }
}

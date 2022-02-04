import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig, DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import {
  AnyDataStreamQuery,
  TimeSeriesDataRequestSettings,
  StyleSettingsMap,
  IoTAppKitSession,
} from '@iot-app-kit/core';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() appKitSession: IoTAppKitSession;

  @Prop() queries: AnyDataStreamQuery[];

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() settings: TimeSeriesDataRequestSettings | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  getSettings(): TimeSeriesDataRequestSettings {
    return {
      ...this.settings,
      fetchMostRecentBeforeEnd: true,
    };
  }

  render() {
    const settings = this.getSettings();
    return (
      <iot-connector
        appKitSession={this.appKitSession}
        queries={this.queries}
        styleSettings={this.styleSettings}
        request={{
          viewport: this.viewport,
          settings,
        }}
        renderFunc={({ dataStreams }) => (
          <sc-table
            dataStreams={dataStreams as SynchroChartsDataStream[]}
            viewport={this.viewport}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

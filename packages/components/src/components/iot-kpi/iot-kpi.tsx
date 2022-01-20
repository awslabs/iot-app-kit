import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, TimeSeriesDataRequestSettings } from '@iot-app-kit/core';
import { StyleSettingsMap } from '../types';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 };

@Component({
  tag: 'iot-kpi',
  shadow: false,
})
export class IotKpi {
  @Prop() appKit: DataModule;

  @Prop() query: AnyDataStreamQuery;

  @Prop() viewport: MinimalViewPortConfig = DEFAULT_VIEWPORT;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() settings: TimeSeriesDataRequestSettings | undefined;

  @Prop() styles: StyleSettingsMap | undefined;

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
        appKit={this.appKit}
        query={this.query}
        request={{
          settings,
          viewport: this.viewport,
        }}
        renderFunc={({ dataStreams }) => (
          <sc-kpi
            dataStreams={dataStreams}
            viewport={this.viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

import { Component, Prop, h } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import { AnyDataStreamQuery, DataModule, TimeSeriesDataRequestSettings } from '@iot-app-kit/core';
import { StyleSettingsMap } from '../types';

const DEFAULT_VIEWPORT = { duration: 10 * 1000 * 60 };

@Component({
  tag: 'iot-status-grid',
  shadow: false,
})
export class IotStatusGrid {
  @Prop() appKit: DataModule;

  @Prop() queries: AnyDataStreamQuery[];

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
        queries={this.queries}
        request={{
          settings,
          viewport: this.viewport,
        }}
        renderFunc={({ dataStreams }) => (
          <sc-status-grid
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

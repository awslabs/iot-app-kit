import { Component, Prop, h, Listen } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import { StyleSettingsMap, SiteWiseTimeSeriesDataProvider } from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../iot-connector/bindStylesToDataStreams';

@Component({
  tag: 'iot-line-chart-demo',
  shadow: false,
})
export class IotLineChart {
  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() provider: SiteWiseTimeSeriesDataProvider;

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    this.provider.updateViewport({ start, end, lastUpdatedBy });
  }

  render() {
    return (
      <iot-time-series-data-connector
        provider={this.provider}
        renderFunc={({ dataStreams, viewport }) => (
          <sc-line-chart
            dataStreams={
              bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings }) as SynchroChartsDataStream[]
            }
            viewport={viewport}
            isEditing={this.isEditing}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

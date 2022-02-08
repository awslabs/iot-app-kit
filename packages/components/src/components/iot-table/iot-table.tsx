import { Component, Prop, h, State, Listen } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import { StyleSettingsMap, SiteWiseTimeSeriesDataProvider, IoTAppKit, TimeSeriesQuery } from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';

@Component({
  tag: 'iot-table',
  shadow: false,
})
export class IotTable {
  @Prop() appKit: IoTAppKit;

  @Prop() query: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;

  @Prop() widgetId: string;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  componentWillLoad() {
    this.provider = this.query.build(this.appKit.session(this.widgetId), {
      fetchMostRecentBeforeEnd: true,
    });
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    this.provider.updateViewport({ start, end, lastUpdatedBy });
  }

  render() {
    return (
      <iot-time-series-connector
        provider={this.provider}
        renderFunc={({ dataStreams, viewport }) => (
          <sc-table
            dataStreams={
              bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings }) as SynchroChartsDataStream[]
            }
            viewport={viewport}
            widgetId={this.widgetId}
          />
        )}
      />
    );
  }
}

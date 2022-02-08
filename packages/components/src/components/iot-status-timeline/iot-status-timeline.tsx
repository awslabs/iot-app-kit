import { Component, Prop, h, Listen, State } from '@stencil/core';
import { DataStream as SynchroChartsDataStream } from '@synchro-charts/core';
import { StyleSettingsMap, SiteWiseTimeSeriesDataProvider, IoTAppKit, TimeSeriesQuery } from '@iot-app-kit/core';
import { bindStylesToDataStreams } from '../common/bindStylesToDataStreams';

@Component({
  tag: 'iot-status-timeline',
  shadow: false,
})
export class IotStatusTimeline {
  @Prop() appKit: IoTAppKit;

  @Prop() query: TimeSeriesQuery<SiteWiseTimeSeriesDataProvider>;

  @Prop() widgetId: string;

  @Prop() isEditing: boolean | undefined;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() provider: SiteWiseTimeSeriesDataProvider;

  componentWillLoad() {
    this.provider = this.query.build(this.appKit.session(this.widgetId), {
      fetchMostRecentBeforeStart: true,
      fetchFromStartToEnd: true,
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
          <sc-status-timeline
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

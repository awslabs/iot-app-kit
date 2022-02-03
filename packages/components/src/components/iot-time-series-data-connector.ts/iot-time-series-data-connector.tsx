import { Component, Listen, Prop, State, Watch } from '@stencil/core';
import isEqual from 'lodash.isequal';
import {
  AnyDataStreamQuery,
  SubscriptionUpdate,
  subscribeToDataStreams,
  DataModule,
  DataStream,
  TimeSeriesDataRequest,
  StyleSettingsMap,
  TimeSeriesData,
  Provider,
} from '@iot-app-kit/core';
import { createTimeSeriesData } from '../iot-connector/bindStylesToDataStreams';

@Component({
  tag: 'iot-time-series-data-connector',
  shadow: false,
})
export class IotTimeSeriesDataConnector<T> {
  @Prop() provider: Provider<(dataStreams: DataStream[]) => void>;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @Prop() renderFunc: ({ timeSeriesData }: { timeSeriesData: TimeSeriesData }) => unknown;

  private timeSeriesData: TimeSeriesData;

  componentWillLoad() {
    this.provider.subscribe((dataStreams: DataStream[]) => {
      this.timeSeriesData = createTimeSeriesData({ dataStreams, styleSettings: this.styleSettings });
    });
  }

  // componentDidUnmount() {
  //   this.unsubscribe();
  // }

  // /**
  //  * Sync subscription to change in queried data
  //  */
  // @Watch('request')
  // @Watch('queries')
  // onUpdateProp(newProp: unknown, oldProp: unknown) {
  //   if (!isEqual(newProp, oldProp) && this.update != null) {
  //     this.update({
  //       queries: this.queries,
  //       request: this.request,
  //     });
  //   }
  // }

  // @Listen('dateRangeChange')
  // private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
  //   if (this.update != null) {
  //     this.update({
  //       request: {
  //         ...this.request,
  //         viewport: { start, end, lastUpdatedBy },
  //       },
  //     });
  //   }
  // }

  render() {
    const { timeSeriesData } = this;

    return this.renderFunc({ timeSeriesData });
  }
}

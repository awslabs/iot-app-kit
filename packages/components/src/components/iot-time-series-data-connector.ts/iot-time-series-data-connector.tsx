import { Component, Listen, Prop, State, Watch } from '@stencil/core';
import isEqual from 'lodash.isequal';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import {
  AnyDataStreamQuery,
  SubscriptionUpdate,
  subscribeToDataStreams,
  DataModule,
  DataStream,
  TimeSeriesDataRequest,
  StyleSettingsMap,
  Provider,
  Query,
  DataStreamCallback,
  AppKitComponentSession,
  DataModuleSubscription,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-time-series-data-connector',
  shadow: false,
})
export class IotTimeSeriesDataConnector {
  @Prop() session: AppKitComponentSession;

  @Prop() query: Query<DataModuleSubscription<AnyDataStreamQuery>, DataStreamCallback>;

  @Prop() viewport: MinimalViewPortConfig;

  @Prop() renderFunc: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;

  @State() provider: Provider<(dataStreams: DataStream[]) => void>;

  private dataStreams: DataStream[];

  componentWillLoad() {
    this.provider = this.query.build(this.session, { viewport: this.viewport });

    this.provider.subscribe((dataStreams: DataStream[]) => {
      this.dataStreams = dataStreams;
    });
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
  }

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
    const { dataStreams } = this;

    return this.renderFunc({ dataStreams });
  }
}

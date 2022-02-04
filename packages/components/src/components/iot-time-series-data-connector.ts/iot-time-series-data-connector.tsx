import { Component, Listen, Prop, State, Watch } from '@stencil/core';
import { MinimalViewPortConfig } from '@synchro-charts/core';
import {
  AnyDataStreamQuery,
  SubscriptionUpdate,
  DataStream,
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
  @Prop() provider: Provider<SubscriptionUpdate<AnyDataStreamQuery>, DataStreamCallback>;

  @Prop() renderFunc: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;

  @State() dataStreams: DataStream[] = [];

  componentDidLoad() {
    this.provider.subscribe((dataStreams: DataStream[]) => {
      this.dataStreams = dataStreams;
    });
  }

  componentDidUnmount() {
    this.provider.unsubscribe();
  }

  render() {
    const { dataStreams } = this;

    return this.renderFunc({ dataStreams });
  }
}

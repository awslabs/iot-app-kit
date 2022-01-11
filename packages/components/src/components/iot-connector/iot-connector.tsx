import { Component, Listen, Prop, State, Watch } from '@stencil/core';
import { DataStream } from '@synchro-charts/core';
import isEqual from 'lodash.isequal';
import {
  AnyDataStreamQuery,
  SubscriptionUpdate,
  subscribeToDataStreams,
  DataModule,
  TimeSeriesDataRequest,
} from '@iot-app-kit/core';

@Component({
  tag: 'iot-connector',
  shadow: false,
})
export class IotConnector {
  @Prop() appKit: DataModule;

  @Prop() query: AnyDataStreamQuery;

  @Prop() request: TimeSeriesDataRequest;

  @Prop() renderFunc: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;

  @State() dataStreams: DataStream[] = [];

  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  private unsubscribe: () => void;

  componentWillLoad() {
    // Subscribe to data module for the requested `query`
    const { update, unsubscribe } = subscribeToDataStreams(
      this.appKit,
      {
        query: this.query,
        request: this.request,
      },
      (dataStreams: DataStream[]) => {
        this.dataStreams = dataStreams;
      }
    );

    // Store references to lifecycle methods
    this.update = update;
    this.unsubscribe = unsubscribe;
  }

  componentDidUnmount() {
    this.unsubscribe();
  }

  /**
   * Sync subscription to change in queried data
   */
  @Watch('request')
  @Watch('query')
  onUpdateProp(newProp: unknown, oldProp: unknown) {
    if (!isEqual(newProp, oldProp) && this.update != null) {
      this.update({
        query: this.query,
        request: this.request,
      });
    }
  }

  @Listen('dateRangeChange')
  private handleDateRangeChange({ detail: [start, end, lastUpdatedBy] }: { detail: [Date, Date, string | undefined] }) {
    if (this.update != null) {
      this.update({
        request: {
          ...this.request,
          viewport: {start, end, lastUpdatedBy}
        },
      });
    }
  }

  render() {
    const { dataStreams } = this;

    return this.renderFunc({ dataStreams });
  }
}

import { Component, Prop, State, Watch } from '@stencil/core';
import { DataStream } from '@synchro-charts/core';
import isEqual from 'lodash.isequal';
import { getDataModule, Request, DataStreamQuery, SubscriptionUpdate } from '@iot-app-kit/core';

@Component({
  tag: 'iot-connector',
  shadow: false,
})
export class IotConnector {
  @Prop() query: DataStreamQuery;

  @Prop() requestInfo: Request;

  @Prop() renderFunc: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;

  @State() dataStreams: DataStream[] = [];

  private update: (subscriptionUpdate: SubscriptionUpdate<DataStreamQuery>) => void;

  private unsubscribe: () => void;

  componentWillLoad() {
    // Subscribe to data module for the requested `query`
    const { update, unsubscribe } = getDataModule().subscribeToDataStreams(
      {
        query: this.query,
        requestInfo: this.requestInfo,
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
  @Watch('requestInfo')
  @Watch('query')
  onUpdateProp(newProp: unknown, oldProp: unknown) {
    if (!isEqual(newProp, oldProp) && this.update != null) {
      this.update({
        query: this.query,
        requestInfo: this.requestInfo,
      });
    }
  }

  render() {
    const { dataStreams } = this;

    return this.renderFunc({ dataStreams });
  }
}

import { Component, Listen, Prop, State, Watch } from '@stencil/core';
import isEqual from 'lodash.isequal';
import {
  AnyDataStreamQuery,
  SubscriptionUpdate,
  DataStream,
  TimeSeriesDataRequest,
  StyleSettingsMap,
  IoTAppKitSession,
} from '@iot-app-kit/core';
import { bindStylesToDataStreams } from './bindStylesToDataStreams';

@Component({
  tag: 'iot-connector',
  shadow: false,
})
export class IotConnector {
  @Prop() appKitSession: IoTAppKitSession;

  @Prop() queries: AnyDataStreamQuery[];

  @Prop() request: TimeSeriesDataRequest;

  @Prop() renderFunc: ({ dataStreams }: { dataStreams: DataStream[] }) => unknown;

  @Prop() styleSettings: StyleSettingsMap | undefined;

  @State() dataStreams: DataStream[] = [];

  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  private unsubscribe: () => void;

  componentWillLoad() {
    // Subscribe to data module for the requested `query`
    const { update, unsubscribe } = this.appKitSession.subscribeToTimeSeriesData(
      {
        queries: this.queries,
        request: this.request,
      },
      (dataStreams: DataStream[]) => {
        this.dataStreams = bindStylesToDataStreams({ dataStreams, styleSettings: this.styleSettings });
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
  @Watch('queries')
  onUpdateProp(newProp: unknown, oldProp: unknown) {
    if (!isEqual(newProp, oldProp) && this.update != null) {
      this.update({
        queries: this.queries,
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
          viewport: { start, end, lastUpdatedBy },
        },
      });
    }
  }

  render() {
    const { dataStreams } = this;

    return this.renderFunc({ dataStreams });
  }
}

import { MinimalViewPortConfig } from '@synchro-charts/core';
import { Provider, IoTAppKitComponentSession } from '../../interface';
import { AnyDataStreamQuery, DataModuleSubscription, SubscriptionUpdate } from '../../data-module/types';
import { datamodule } from '../..';
import { subscribeToTimeSeriesData } from './coordinator';
import { TimeSeriesData } from './types';

/**
 * SiteWise time series data provider.
 */
export class SiteWiseTimeSeriesDataProvider implements Provider<TimeSeriesData> {
  private session: IoTAppKitComponentSession;

  // store a copy of the input query / subscription
  private input: DataModuleSubscription<AnyDataStreamQuery>;

  // reference to the time series module update method returned on subscribe
  private update: (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => void;

  constructor(session: IoTAppKitComponentSession, input: DataModuleSubscription<AnyDataStreamQuery>) {
    this.session = session;
    this.input = input;
  }

  // decorate time series data with viewport
  subscribe = (callback: (data: TimeSeriesData) => void) => {
    const { session } = this;

    const { update } = subscribeToTimeSeriesData(
      datamodule.iotsitewise.timeSeriesDataSession(session),
      datamodule.iotsitewise.assetDataSession(session)
    )(this.input, (dataStreams) => {
      callback({
        dataStreams,
        viewport: this.input.request.viewport,
      });
    });

    this.update = update;
  };

  // update a subscription without resubscribing
  updateSubscription = (subscriptionUpdate: SubscriptionUpdate<AnyDataStreamQuery>) => {
    this.update(subscriptionUpdate);
  };

  // delegate to app kit session to close all module sessions
  unsubscribe = () => {
    this.session.close();
  };

  // support viewport updates via gestures
  updateViewport = (viewport: MinimalViewPortConfig) => {
    const request = {
      ...this.input.request,
      viewport,
    };

    /**
     * Time series module currently doesn't return viewport, so this provider needs to be stateful.
     * @todo refactor time series module to return TimeSeriesData and we no longer need to store input.
     */
    this.input = {
      ...this.input,
      request,
    };

    this.update({ request });
  };
}
